// InvoiceSummary.tsx
import { Product } from "../../lib/types";

interface InvoiceSummaryProps {
    products: Product[];
}

const InvoiceSummary = ({ products }: InvoiceSummaryProps) => {
    const totals = products.reduce(
        (acc, product) => {
            const taxableValue = product.qty * product.salePrice * (1 - (product.discount || 0) / 100);
            const gst = taxableValue * 0.18;
            const totalValue = taxableValue + gst;

            return {
                taxableValue: acc.taxableValue + taxableValue,
                gst: acc.gst + gst,
                total: acc.total + totalValue,
            };
        },
        { taxableValue: 0, gst: 0, total: 0 }
    );

    return (
        <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500">Total Taxable Value</h3>
                    <p className="text-xl font-semibold">₹{totals.taxableValue.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500">Total GST (18%)</h3>
                    <p className="text-xl font-semibold">₹{totals.gst.toFixed(2)}</p>
                    <div className="text-xs text-gray-500 mt-1">
                        CGST (9%): ₹{(totals.gst / 2).toFixed(2)} | SGST (9%): ₹{(totals.gst / 2).toFixed(2)}
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-blue-600">Total Invoice Amount</h3>
                    <p className="text-xl font-semibold text-blue-600">₹{totals.total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSummary;