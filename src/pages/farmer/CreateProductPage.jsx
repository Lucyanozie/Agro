import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/context/ToastContext';
import { PageHeader } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { UploadBox } from '@/components/ui/UploadBox';
import { CATEGORIES } from '@/data/seed';
import { cx } from '@/lib/utils';
const UNITS = ['kg', 'bag', 'crate', 'tuber', 'litre', 'basket'];
/** Fallback artwork when a farmer publishes without choosing a photo. */
const PLACEHOLDERS = {
    vegetables: '/img/bell-pepper.png',
    fruits: '/img/pineapple.png',
    grains: '/img/rice.png',
    proteins: '/img/cat-proteins.jpg',
    roots: '/img/potato.png',
    processed: '/img/cat-processed.jpg',
    spices: '/img/cat-spices.jpg',
};
export function CreateProductPage() {
    const { id } = useParams();
    const { byId, addProduct, updateProduct } = useProducts();
    const { notify } = useToast();
    const navigate = useNavigate();
    const editing = Boolean(id);
    const existing = id ? byId(id) : undefined;
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [available, setAvailable] = useState('');
    const [unit, setUnit] = useState('kg');
    const [description, setDescription] = useState('');
    const [imageName, setImageName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (!existing)
            return;
        setName(existing.name);
        setCategory(CATEGORIES.find((c) => c.slug === existing.category)?.name ?? '');
        setPrice(String(existing.price));
        setAvailable(String(existing.available));
        setUnit(existing.unit);
        setDescription(existing.description);
        setImageUrl(existing.image);
    }, [existing]);
    function submit(e) {
        e.preventDefault();
        const next = {};
        if (name.trim().length < 2)
            next.name = 'Give your produce a name';
        if (!category)
            next.category = 'Choose a category';
        if (!Number(price) || Number(price) <= 0)
            next.price = 'Enter a price above zero';
        if (!Number(available) || Number(available) <= 0)
            next.available = 'Enter the quantity you have';
        if (description.trim().length < 10)
            next.description = 'Add a short description (10+ characters)';
        setErrors(next);
        if (Object.keys(next).length)
            return;
        const slug = CATEGORIES.find((c) => c.name === category)?.slug ??
            'vegetables';
        const payload = {
            name: name.trim(),
            category: slug,
            price: Number(price),
            available: Number(available),
            unit,
            description: description.trim(),
            image: imageUrl || PLACEHOLDERS[slug],
        };
        if (editing && existing) {
            updateProduct(existing.id, payload);
            notify(`${payload.name} updated`);
            navigate(`/farmer/products/${existing.id}`, { replace: true });
        }
        else {
            const created = addProduct(payload);
            navigate('/farmer/published', { replace: true, state: { productId: created.id } });
        }
    }
    return (<>
      <PageHeader title={editing ? 'Edit Product' : 'Add New Produce'} backTo={editing && existing ? `/farmer/products/${existing.id}` : '/farmer/marketplace'}/>

      <form onSubmit={submit} noValidate className="mx-auto w-full max-w-2xl px-4 pb-12 lg:px-8">
        <div className="relative">
          <UploadBox accept="image/*" icon={<ImagePlus className="h-9 w-9 text-brand-600"/>} title="Add a product photo" subtitle="PNG or JPG (Max 5MB)" tone="green" value={imageName} onChange={(fileName, dataUrl) => {
            setImageName(fileName);
            setImageUrl(dataUrl ?? '');
        }} className={cx(imageUrl && !imageName && 'hidden')}/>
          {imageUrl && !imageName ? (<div className="flex items-center gap-4 rounded-xl border border-ink-line p-3">
              <img src={imageUrl} alt="" className="h-20 w-24 rounded-lg object-contain"/>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-ink">Current photo</p>
                <button type="button" onClick={() => setImageUrl('')} className="mt-1 text-sm font-semibold text-brand-600 hover:underline">
                  Choose a different photo
                </button>
              </div>
            </div>) : null}
        </div>

        <div className="mt-5 space-y-4">
          <TextField label="Product Name" placeholder="e.g. Fresh Tomatoes" value={name} onChange={(e) => setName(e.target.value)} error={errors.name}/>

          <SelectField label="Category" placeholder="Select a category" options={CATEGORIES.map((c) => c.name)} value={category} onChange={(e) => setCategory(e.target.value)} error={errors.category}/>

          <div className="grid grid-cols-2 gap-4">
            <TextField label="Price (₦)" inputMode="numeric" placeholder="830" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} error={errors.price}/>
            <SelectField label="Unit" placeholder="Select unit" options={UNITS} value={unit} onChange={(e) => setUnit(e.target.value)}/>
          </div>

          <TextField label="Available Quantity" inputMode="numeric" placeholder="100" hint={`How many ${unit} you currently have in stock`} value={available} onChange={(e) => setAvailable(e.target.value.replace(/\D/g, ''))} error={errors.available}/>

          <TextAreaField label="Description" placeholder="Tell buyers how it was grown, when it was harvested and how it is packed." value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} maxLength={320} hint={`${description.length}/320`}/>
        </div>

        <Button type="submit" block className="mt-8">
          {editing ? 'Save Changes' : 'Publish Product'}
        </Button>
      </form>
    </>);
}
