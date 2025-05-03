'use client'
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceSchema } from '../../lib/types';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import ProductTable from './ProductTable';
import { toast } from 'react-toastify';

type InvoiceFormData = z.infer<typeof invoiceSchema>;

const productsList = [
    { name: 'Product A', hsnCode: '1001' },
    { name: 'Product B', hsnCode: '1002' },
    { name: 'Product C', hsnCode: '1003' },
];

export default function InvoiceForm() {
    const [totals, setTotals] = useState<{
        totalTaxableValue: number; // types
        totalGst: number;
        totalInvoiceValue: number;
        calculatedProducts: {
            productName: string;
            hsnCode: string;
            qty: number;
            salePrice: number;
            discount: number;
            taxableValue: number;
            gst: number;
            totalValue: number;
        }[];
    }>({
        totalTaxableValue: 0,
        totalGst: 0,
        totalInvoiceValue: 0,
        calculatedProducts: [],
    });

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            invoiceNo: "",
            invoiceDate: new Date().toISOString().split('T')[0],
            customer: {
                name: "",
                address: "",
                gstin: "",
            },
            products: [
                {
                    productName: "",
                    hsnCode: "",
                    qty: 0,
                    salePrice: 0,
                    discount: 0,
                },
            ],
            paymentMethod: undefined,
            transactionId: "",
            narration: "",
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'products' });
    const watchedProducts = useWatch({
        control,
        name: "products",
    });

    const paymentMethod = watch('paymentMethod');

    // calculate bill function
    useEffect(() => {
        const updated = watchedProducts.map((item) => {
            const qty = Number(item.qty) || 0;
            const salePrice = Number(item.salePrice) || 0;
            const discount = Number(item.discount) || 0;

            const subTotal = qty * salePrice; // total
            const discountAmount = (subTotal / 100) * discount // calculate discount
            const taxableValue = subTotal - discountAmount;
            const gst = +(taxableValue * 0.18).toFixed(2); // split into CGST/SGST if needed
            const totalValue = +(taxableValue + gst).toFixed(2);

            return {
                productName: item.productName,
                hsnCode: item.hsnCode,
                qty,
                salePrice,
                discount,
                taxableValue: +taxableValue.toFixed(2),
                gst,
                totalValue,
            };
        });

        const totalTaxableValue = updated.reduce((sum, p) => sum + p.taxableValue, 0);
        const totalGst = updated.reduce((sum, p) => sum + p.gst, 0);
        const totalInvoiceValue = updated.reduce((sum, p) => sum + p.totalValue, 0);

        setTotals({
            totalTaxableValue,
            totalGst,
            totalInvoiceValue,
            calculatedProducts: updated,
        });

    }, [watchedProducts]);


    const onSubmit = (data: InvoiceFormData) => {
        const payload = {
            ...data,
            totalInvoiceValue: totals.totalInvoiceValue,
            products: totals.calculatedProducts,
        };
        toast.success('Form submitted successfully', { autoClose: 3000 });
        reset()
        console.log("Final Payload:", payload);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Invoice Creation Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Invoice Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Invoice Number</label>
                        <input {...register('invoiceNo')} className="input" placeholder='invoice number' />
                        <p className="text-red-500">{errors.invoiceNo?.message}</p>
                    </div>
                    <div>
                        <label>Invoice Date</label>
                        <input
                            type="date"
                            {...register('invoiceDate')}
                            className="input"
                        // defaultValue={new Date().toISOString().split('T')[0]}
                        />
                        <p className="text-red-500">{errors.invoiceDate?.message}</p>
                    </div>
                </div>

                {/* Customer Details */}
                <div className='flex flex-col gap-2'>
                    <h2 className="text-xl font-semibold">Customer Details</h2>
                    <input {...register('customer.name')} placeholder="Customer Name" className="input" />
                    <p className="text-red-500">{errors.customer?.name?.message}</p>

                    <input {...register('customer.address')} placeholder="Customer Address" className="input" />
                    <p className="text-red-500">{errors.customer?.address?.message}</p>

                    <input {...register('customer.gstin')} placeholder="GSTIN (optional)" className="input" />
                </div>

                {/* Product Table */}
                <div className='flex flex-col'>
                    <h2 className="text-xl font-semibold">Products</h2>
                    {fields.map((field, index) => (
                        <ProductTable
                            key={field.id}
                            field={field}
                            index={index}
                            register={register}
                            setValue={setValue}
                            remove={remove}
                            errors={errors}
                            productsList={productsList}
                        />
                    ))}
                    <button type="button"
                        onClick={() =>
                            append({ productName: '', hsnCode: '', qty: 1, salePrice: 0, discount: 0 })}
                        className="btn mt-2 w-40 cursor-pointer hover:bg-blue-400 bg-blue-600">
                        Add Product
                    </button>
                </div>


                {/* Summary */}
                <div className="rounded">
                    <p>Total Taxable Value: ₹{totals.totalTaxableValue.toFixed(2)}</p>
                    <p>GST (18%): ₹{totals.totalGst.toFixed(2)}</p>
                    <p className="font-bold">Final Invoice Amount: ₹{totals.totalInvoiceValue.toFixed(2)}</p>
                </div>

                {/* Payment */}
                <div>
                    <label>Payment Method</label>
                    <select {...register('paymentMethod')} className="input bg-slate-900 border border-white">
                        <option value="Cash">Cash</option>
                        <option value="Online Transfer">Online Transfer</option>
                        <option value="On Credit">On Credit</option>
                    </select>

                    {paymentMethod === 'Online Transfer' && (
                        <div className='mt-4'>
                            <span>Transaction Id</span>
                            <input {...register('transactionId')} placeholder="Transaction ID" className="input mt-2" />
                        </div>
                    )}
                </div>

                {/* Narration */}
                <div>
                    <span>Remarks</span>
                    <textarea {...register('narration')} placeholder="remarks" className="input w-full h-20" />
                </div>

                <button type="submit"
                    className="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-400 cursor-pointer">Submit</button>
            </form >
        </div >
    );
}
