
import React from 'react'
import { UseFormRegister, UseFormSetValue, FieldErrors, UseFieldArrayAppend } from 'react-hook-form';

interface Product {
    name: string,
    hsnCode: string
}

interface ProductField {
    id: string,
    productName: string;
    hsnCode: string;
    qty: number;
    salePrice: number;
    discount?: number;
}

interface props {
    field: ProductField;
    index: number;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    remove: (index: number) => void;
    errors: FieldErrors<{ products: ProductField[] }>;
    productsList: Product[];
}

const ProductTable: React.FC<props> = ({
    field,
    index,
    register,
    setValue,
    remove,
    errors,
    productsList }) => {
    return (
        <div> <div key={field.id} className="grid md:grid-cols-6 gap-2 mb-2 items-end">
            <div className=''>
                <span>Product Name</span>
                <select
                    {...register(`products.${index}.productName`)}
                    className="input bg-slate-900"
                    onChange={(e) => {
                        const product = productsList.find(p => p.name === e.target.value);
                        setValue(`products.${index}.productName`, e.target.value);
                        setValue(`products.${index}.hsnCode`, product?.hsnCode || '');
                    }}
                >
                    <option value="">Select</option>
                    {productsList.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <span>Hsn Code</span>
                <input
                    {...register(`products.${index}.hsnCode`)}
                    className="input"
                    readOnly
                />
            </div>

            <div>
                <span className='text-white'>Quantity</span>
                <input
                    type="text"
                    {...register(`products.${index}.qty`, { valueAsNumber: true })}
                    className="input"
                    placeholder="Qty"
                />
            </div>

            <div>
                <span>Price</span>
                <input
                    type="text"
                    {...register(`products.${index}.salePrice`, { valueAsNumber: true })}
                    className="input"
                    placeholder="Price"
                />
            </div>

            <div>
                <span>Discount</span>
                <input
                    type="text"
                    {...register(`products.${index}.discount`, { valueAsNumber: true })}
                    className="input"
                    placeholder="Discount"
                />
            </div>

            <button type="button"
                onClick={() => remove(index)}
                className="text-red-500 cursor-pointer border p-2 rounded hover:bg-red-300 hover:text-black mt-2 md:mt-0">Remove</button>
        </div>
            <span className="text-red-500">{
                (errors.products?.[index]?.qty?.message && <span>Quantity: {errors.products[index]?.qty?.message}</span>) ||
                (errors.products?.[index]?.discount?.message && <span>Discount: {errors.products[index]?.discount?.message}</span>) ||
                (errors.products?.[index]?.salePrice?.message && <span>SalePrice: {errors.products?.[index]?.salePrice?.message}</span>)
            }</span>
        </div>
    )
}

export default ProductTable