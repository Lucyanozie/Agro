import { Link } from 'react-router-dom';
export function CategoryCard({ category }) {
    return (<Link to={`/buyer/category/${category.slug}`} className="group flex w-full flex-col items-center gap-2 text-center">
      <span className="block h-[88px] w-[88px] overflow-hidden rounded-full ring-1 ring-ink-line/60 transition group-hover:ring-brand-300">
        <img src={category.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
      </span>
      <span className="text-[15px] font-medium leading-tight text-ink">{category.name}</span>
    </Link>);
}
