import { useState } from "react"
import "./InvoiceForm.css"

export default function InvoiceForm({
  invoiceData,
  availableProducts,
  availableCoupons,
  onInputChange,
  onCustomerChange,
  onAddItem,
  onRemoveItem,
  onApplyTax,
  onApplyDiscount,
  onPrintInvoice,
  calculateSubtotal,
  calculateTax,
  calculateDiscount,
  calculateTotal,
  calculateCategoryTaxes,
}) {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [discountCode, setDiscountCode] = useState("")

  const handleSubmitItem = (e) => {
    e.preventDefault()
    if (selectedProduct) {
      onAddItem(selectedProduct, quantity)
      setSelectedProduct("")
      setQuantity(1)
    }
  }

  const handleSubmitDiscount = (e) => {
    e.preventDefault()
    if (discountCode) {
      onApplyDiscount(discountCode)
      setDiscountCode("")
    }
  }

  return (
    <div className="invoice-form-container">
      <h2>Invoice Details</h2>

      <div className="form-section">
        <h3>Customer Information</h3>
        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            value={invoiceData.customer.name}
            onChange={(e) => onCustomerChange("name", e.target.value)}
            placeholder="Enter customer name"
            defaultValue="Guest Customer"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={invoiceData.customer.email}
            onChange={(e) => onCustomerChange("email", e.target.value)}
            placeholder="Enter customer email"
            defaultValue="guest@example.com"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            value={invoiceData.customer.phone}
            onChange={(e) => onCustomerChange("phone", e.target.value)}
            placeholder="Enter customer phone"
            defaultValue="+91 98765 43210"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Invoice Information</h3>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={invoiceData.dueDate} onChange={(e) => onInputChange("dueDate", e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <h3>Products</h3>
        <form onSubmit={handleSubmitItem} className="add-item-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product</label>
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                <option value="">Select a product</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>

            <button type="submit" className="add-item-btn">
              Add Item
            </button>
          </div>
        </form>

        <div className="items-list">
          <h4>Added Items</h4>
          {invoiceData.items.length === 0 ? (
            <p className="no-items">No items added yet</p>
          ) : (
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Tax</th>
                  <th>Total</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>{(() => {
                      // Find tax rate for this item's category
                      const catTaxes = calculateCategoryTaxes();
                      return catTaxes[item.category]?.taxRate ? `${catTaxes[item.category].taxRate}%` : "-";
                    })()}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>{item.category}</td>
                    <td>
                      <button className="remove-item-btn" onClick={() => onRemoveItem(item.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Discounts & Taxes</h3>

        <form onSubmit={handleSubmitDiscount} className="discount-form">
          <div className="form-row">
            <div className="form-group">
              <label>Discount Coupon</label>
              <select value={discountCode} onChange={(e) => setDiscountCode(e.target.value)}>
                <option value="">Select a coupon</option>
                {availableCoupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.name} - {coupon.type === "percentage" ? `${coupon.amount}%` : `$${coupon.amount}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="apply-discount-btn"
              disabled={invoiceData.discountApplied || !discountCode}
            >
              Apply Discount
            </button>
          </div>
        </form>
      </div>

      <div className="form-section totals-section">
        <div className="totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>

          {/* Tax breakdown by category */}
          {invoiceData.items.length > 0 && (
            <>
              <div className="total-row" style={{fontWeight:600,marginTop:'1em'}}>Tax Breakdown:</div>
              {Object.entries(calculateCategoryTaxes()).map(([cat, t]) => (
                <div className="total-row" key={cat}>
                  <span>{cat} ({t.taxRate}%): SGST ({(t.taxRate/2)}%) + CGST ({(t.taxRate/2)}%)</span>
                  <span>SGST: ${t.sgst.toFixed(2)} | CGST: ${t.cgst.toFixed(2)}</span>
                </div>
              ))}
              <div className="total-row">
                <span>Total Tax:</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
            </>
          )}

          {invoiceData.discountApplied && (
            <div className="total-row discount">
              <span>Discount ({invoiceData.discountCode}):</span>
              <span>-${calculateDiscount().toFixed(2)}</span>
            </div>
          )}

          <div className="total-row grand-total">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          className="print-invoice-btn"
          onClick={onPrintInvoice}
          disabled={invoiceData.items.length === 0}
        >
          <span className="text">Print Receipt</span>
          <span className="blob"></span>
          <span className="blob"></span>
          <span className="blob"></span>
          <span className="blob"></span>
        </button>
      </div>
    </div>
  )
}
