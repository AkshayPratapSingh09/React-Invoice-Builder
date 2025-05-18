import "./InvoicePreview.css"

export default function InvoicePreview({ invoiceData, subtotal, tax, discount, total, animatingField, calculateCategoryTaxes, onRemoveDiscount }) {
  const getAnimationClass = (field) => {
    return animatingField === field ? "animate-field" : ""
  }

  return (
    <div className="invoice-preview-container">
      <div className="preview-header">
        <h2>Preview</h2>
        <div className="preview-actions">
          <button className="preview-action-btn">PDF</button>
          <button className="preview-action-btn">Email</button>
        </div>
      </div>

      <div className="invoice-preview">
        <div className={`invoice-header ${getAnimationClass("header")}`}>
          <h1>{invoiceData.header}</h1>
          <div className="invoice-number">{invoiceData.invoiceNumber}</div>
        </div>

        <div className="invoice-info">
          <div className={`invoice-info-section ${getAnimationClass("dueDate")}`}>
            <h3>Invoice Details</h3>
            <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
            <p><strong>Bill #:</strong> {invoiceData.billNumber}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
            <p><strong>Cashier ID:</strong> {invoiceData.cashierId}</p>
            <p><strong>GSTIN:</strong> {invoiceData.gstin}</p>
            <p><strong>Due Date:</strong> {new Date(invoiceData.dueDate).toLocaleDateString()}</p>
          </div>

          <div className={`invoice-info-section ${getAnimationClass("subject")}`}>
            <h3>Subject</h3>
            <p>{invoiceData.subject || "N/A"}</p>
          </div>
        </div>

        <div className="invoice-parties">
          <div className={`invoice-customer ${getAnimationClass("customer")}`}>
            <h3>Billed To</h3>
            <p className={getAnimationClass("customer.name")}>{invoiceData.customer.name || "Customer Name"}</p>
            <p className={getAnimationClass("customer.email")}>
              {invoiceData.customer.email || "customer@example.com"}
            </p>
            <p className={getAnimationClass("customer.phone")}>{invoiceData.customer.phone || "Phone Number"}</p>
          </div>

          <div className="invoice-company">
            <h3>From</h3>
            <p>InvoicePro Inc.</p>
            <p>123 Business Street</p>
            <p>contact@invoicepro.com</p>
            <p>(123) 456-7890</p>
          </div>
        </div>

        <div className={`invoice-items ${getAnimationClass("items")}`}>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Tax</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-items">
                    No items added yet
                  </td>
                </tr>
              ) : (
                invoiceData.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>{(() => {
                      const catTaxes = calculateCategoryTaxes();
                      return catTaxes[item.category]?.taxRate ? `${catTaxes[item.category].taxRate}%` : "-";
                    })()}</td>
                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td>{item.category}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Discount tag UI above totals */}
        {invoiceData.discountApplied && (
          <div style={{margin: '1em 0'}}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#e0e7ff',
              color: '#3730a3',
              borderRadius: '16px',
              padding: '0.25em 0.75em',
              fontWeight: 500,
              fontSize: '0.95em',
              marginRight: '0.5em',
            }}>
              {invoiceData.discountCode} - {invoiceData.discountType === 'percentage' ? `${invoiceData.discountAmount}%` : `$${invoiceData.discountAmount}`} 
              <button
                style={{
                  marginLeft: '0.75em',
                  background: 'none',
                  border: 'none',
                  color: '#3730a3',
                  fontWeight: 700,
                  fontSize: '1em',
                  cursor: 'pointer',
                  padding: 0,
                }}
                onClick={onRemoveDiscount}
                title="Remove discount"
              >
                ×
              </button>
            </span>
          </div>
        )}

        <div className="invoice-summary">
          <div className="invoice-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Only show total tax in totals section now */}
            {invoiceData.items.length > 0 && (
              <div className="total-row">
                <span>Total Tax:</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            )}

            {/* Discount row removed, now handled by tag above */}

            <div className="total-row grand-total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={`invoice-footer ${getAnimationClass("footer")}`}>
          <p>{invoiceData.footer}</p>
        </div>
      </div>
    </div>
  )
}
