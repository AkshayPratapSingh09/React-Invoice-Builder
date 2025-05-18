import { useState } from "react"
import InvoiceForm from "./InvoiceForm"
import InvoicePreview from "./InvoicePreview"
import { generateInvoiceNumber } from "../utils/helpers"
import { products } from "../data/products"
import { discountCoupons } from "../data/discounts"
import "./InvoiceBuilder.css"

// Tax rates by category (example: India GST split equally between SGST and CGST)
const TAX_RATES = {
  "Fashion & Clothing": 12, // 6% SGST + 6% CGST
  "Electronics": 18, // 9% SGST + 9% CGST
  "Homeware": 8, // 4% SGST + 4% CGST
}

function getCategoryTaxRate(category) {
  return TAX_RATES[category] || 0
}

function getCategorySGST(category) {
  return getCategoryTaxRate(category) / 2
}

function getCategoryCGST(category) {
  return getCategoryTaxRate(category) / 2
}

// Group items by category for tax calculation
function groupItemsByCategory(items) {
  const groups = {}
  items.forEach(item => {
    if (!groups[item.category]) groups[item.category] = []
    groups[item.category].push(item)
  })
  return groups
}

export default function InvoiceBuilder() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    customer: {
      name: "Guest Customer",
      email: "guest@example.com",
      phone: "+91 98765 43210",
    },
    subject: "Shopping Bill",
    dueDate: new Date().toISOString().split("T")[0],
    items: [],
    taxApplied: false,
    taxRate: 10,
    discountApplied: false,
    discountCode: "",
    discountAmount: 0,
    discountType: "percentage",
    cashierId: "CASH" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    gstin: "29ABCDE1234F1Z5",
    billNumber: "BILL" + Math.floor(Math.random() * 10000).toString().padStart(5, '0'),
    header: "INVOICE",
    footer: "Thank you for your business!"
  })

  const [availableProducts, setAvailableProducts] = useState(products)
  const [availableCoupons, setAvailableCoupons] = useState(discountCoupons)
  const [animatingField, setAnimatingField] = useState(null)

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  // Calculate tax per category
  const calculateCategoryTaxes = () => {
    const groups = groupItemsByCategory(invoiceData.items)
    const result = {}
    Object.entries(groups).forEach(([category, items]) => {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const taxRate = getCategoryTaxRate(category)
      const sgst = subtotal * (getCategorySGST(category) / 100)
      const cgst = subtotal * (getCategoryCGST(category) / 100)
      result[category] = { subtotal, sgst, cgst, taxRate }
    })
    return result
  }

  const calculateTotalTax = () => {
    const catTaxes = calculateCategoryTaxes()
    return Object.values(catTaxes).reduce((sum, t) => sum + t.sgst + t.cgst, 0)
  }

  const calculateDiscount = () => {
    if (!invoiceData.discountApplied) return 0
    if (invoiceData.discountType === "percentage") {
      return calculateSubtotal() * (invoiceData.discountAmount / 100)
    } else {
      return invoiceData.discountAmount
    }
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTotalTax() - calculateDiscount()
  }

  const handleInputChange = (field, value) => {
    setInvoiceData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      }

      // Trigger animation for the field
      setAnimatingField(field)
      setTimeout(() => setAnimatingField(null), 1000)

      return newData
    })
  }

  const handleCustomerChange = (field, value) => {
    setInvoiceData((prev) => {
      const newData = {
        ...prev,
        customer: {
          ...prev.customer,
          [field]: value,
        },
      }

      // Trigger animation for the customer field
      setAnimatingField(`customer.${field}`)
      setTimeout(() => setAnimatingField(null), 1000)

      return newData
    })
  }

  const handleAddItem = (productId, quantity) => {
    const product = availableProducts.find((p) => p.id === productId)
    if (product) {
      setInvoiceData((prev) => {
        const existingItemIndex = prev.items.findIndex((item) => item.id === productId)
        if (existingItemIndex >= 0) {
          const updatedItems = [...prev.items]
          updatedItems[existingItemIndex].quantity += Number.parseInt(quantity)
          return {
            ...prev,
            items: updatedItems,
          }
        } else {
          const newItem = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: Number.parseInt(quantity),
            category: product.category,
          }
          setAnimatingField("items")
          setTimeout(() => setAnimatingField(null), 1000)
          return {
            ...prev,
            items: [...prev.items, newItem],
          }
        }
      })
    }
  }

  const handleRemoveItem = (itemId) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }))
  }

  const handleApplyDiscount = (code) => {
    const coupon = availableCoupons.find((c) => c.code === code)

    if (coupon) {
      setInvoiceData((prev) => ({
        ...prev,
        discountApplied: true,
        discountCode: coupon.code,
        discountAmount: coupon.amount,
        discountType: coupon.type,
      }))

      // Trigger animation for discount
      setAnimatingField("discount")
      setTimeout(() => setAnimatingField(null), 1000)
    }
  }

  const handleRemoveDiscount = () => {
    setInvoiceData((prev) => ({
      ...prev,
      discountApplied: false,
      discountCode: "",
      discountAmount: 0,
      discountType: "percentage",
    }))
  }

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank")
    const companyName = "InvoicePro Ltd."
    const companyAddress = "123 Business Rd, City, Country"
    const companyEmail = "info@invoicepro.com"
    const companyPhone = "+1 234 567 890"
    const logoUrl = "https://dummyimage.com/80x80/6366f1/fff&text=Logo"
    const customer = invoiceData.customer
    const items = invoiceData.items
    const today = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()
    let itemsRows = items.map(item => `
      <tr>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;">${item.name}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;">${getCategoryTaxRate(item.category)}%</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;">${item.category}</td>
      </tr>
    `).join("")
    const catTaxes = calculateCategoryTaxes()
    let taxRows = Object.entries(catTaxes).map(([cat, t]) => `
      <tr>
        <td style='padding:8px 12px;'>${cat} (${TAX_RATES[cat]}%)</td>
        <td style='padding:8px 12px;text-align:right;'>SGST (${getCategorySGST(cat)}%): ${t.sgst.toFixed(2)}</td>
        <td style='padding:8px 12px;text-align:right;'>CGST (${getCategoryCGST(cat)}%): ${t.cgst.toFixed(2)}</td>
      </tr>
    `).join("")
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #222; margin: 0; padding: 0; }
            .invoice-print-container { max-width: 800px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 40px; }
            .invoice-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; margin-bottom: 32px; }
            .company-info { display: flex; align-items: center; gap: 18px; }
            .company-logo { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }
            .company-details { font-size: 15px; color: #555; }
            .invoice-title { font-size: 2rem; font-weight: 700; color: #6366f1; letter-spacing: -1px; }
            .invoice-details { margin-bottom: 32px; display: flex; justify-content: space-between; }
            .details-block { font-size: 15px; color: #333; }
            .details-block strong { display: block; color: #6366f1; font-size: 13px; margin-bottom: 2px; }
            .customer-info { margin-bottom: 32px; }
            .customer-info strong { color: #6366f1; font-size: 13px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            .items-table th { background: #f8fafc; color: #222; font-weight: 600; padding: 10px 12px; border: 1px solid #e5e7eb; }
            .items-table td { background: #fff; }
            .tax-breakdown-table { width: 100%; margin-bottom: 24px; border-collapse: collapse; }
            .tax-breakdown-table td { border: 1px solid #e5e7eb; font-size: 15px; }
            .summary-table { margin-left: auto; width: 320px; border-collapse: collapse; }
            .summary-table td { padding: 8px 12px; font-size: 15px; }
            .summary-table .label { color: #555; }
            .summary-table .value { text-align: right; }
            .summary-table .total { font-weight: 700; color: #222; border-top: 2px solid #e5e7eb; font-size: 1.1em; }
            .invoice-footer { margin-top: 40px; text-align: center; color: #888; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 18px; }
            @media print { body { background: #fff; } .invoice-print-container { box-shadow: none; margin: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-print-container">
            <div class="invoice-header">
              <div class="company-info">
                <img src="${logoUrl}" class="company-logo" alt="Company Logo" />
                <div class="company-details">
                  <div style="font-weight:700;font-size:1.2em;">${companyName}</div>
                  <div>${companyAddress}</div>
                  <div>${companyEmail}</div>
                  <div>${companyPhone}</div>
                </div>
              </div>
              <div class="invoice-title">${invoiceData.header}</div>
            </div>
            <div class="invoice-details">
              <div class="details-block">
                <strong>Invoice #</strong> ${invoiceData.invoiceNumber}<br/>
                <strong>Bill #</strong> ${invoiceData.billNumber}<br/>
                <strong>Date</strong> ${today}<br/>
                <strong>Time</strong> ${currentTime}<br/>
                <strong>Cashier ID</strong> ${invoiceData.cashierId}<br/>
                <strong>GSTIN</strong> ${invoiceData.gstin}<br/>
                <strong>Due Date</strong> ${new Date(invoiceData.dueDate).toLocaleDateString()}
              </div>
              <div class="details-block">
                <strong>Billed To</strong> ${customer.name || "Customer Name"}<br/>
                ${customer.email || "customer@email.com"}<br/>
                ${customer.phone || "Phone"}
              </div>
            </div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Tax</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows || `<tr><td colspan="6" style="text-align:center;color:#aaa;">No items</td></tr>`}
              </tbody>
            </table>
            <table class="summary-table">
              <tbody>
                <tr><td class="label">Subtotal</td><td class="value">₹${calculateSubtotal().toFixed(2)}</td></tr>
                <tr><td class="label">Total Tax</td><td class="value">₹${calculateTotalTax().toFixed(2)}</td></tr>
                <tr><td class="label">Discount</td><td class="value">${invoiceData.discountApplied ? `-₹${calculateDiscount().toFixed(2)}` : "₹0.00"}</td></tr>
                <tr><td colspan="2" class="total">Total: ₹${calculateTotal().toFixed(2)}</td></tr>
              </tbody>
            </table>
            <div class="invoice-footer">
              <span style="color:#6366f1;">${invoiceData.footer || ""}</span>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  return (
    <div className="invoice-builder">
      <div className="header">
        <div className="logo">InvoicePro</div>
        <h1>Create Invoice</h1>
      </div>

      <div className="invoice-container">
        <InvoiceForm
          invoiceData={invoiceData}
          availableProducts={availableProducts}
          availableCoupons={availableCoupons}
          onInputChange={handleInputChange}
          onCustomerChange={handleCustomerChange}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onApplyDiscount={handleApplyDiscount}
          onPrintInvoice={handlePrintInvoice}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTotalTax}
          calculateDiscount={calculateDiscount}
          calculateTotal={calculateTotal}
          calculateCategoryTaxes={calculateCategoryTaxes}
        />

        <InvoicePreview
          invoiceData={invoiceData}
          subtotal={calculateSubtotal()}
          tax={calculateTotalTax()}
          discount={calculateDiscount()}
          total={calculateTotal()}
          animatingField={animatingField}
          calculateCategoryTaxes={calculateCategoryTaxes}
          onRemoveDiscount={handleRemoveDiscount}
        />
      </div>
    </div>
  )
}
