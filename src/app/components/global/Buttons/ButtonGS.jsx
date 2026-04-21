import { Button } from "@/components/ui/button"
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";


export const ButtonGS = ({ 
  content="Browse Apartments", 
  uppercase = true,
  className='',
  cta = '/apartments'
 }) => {
  return (
    <Link href={cta}>
      <Button
        variant="ghost"
        className={` 
        ${className}  
        ${uppercase && "uppercase"} 
        !bg-primary !text-white font-medium hover:!bg-primary/70
        transition-all duration-300 ease-in-out
        rounded-full h-12 lg:w-[12rem]`}>{ content }
      </Button>
    </Link>
  )
}

export const FindaHome = ({ content = "List Your Property", uppercase = true, cta='/auth' }) => {
  return (
    <Link href={cta}>
      <Button
        variant="ghost"
        className={` 
        ${uppercase && "uppercase"} 
        !bg-transparent rounded-full h-12 
        w-[12rem] border !border-primary !text-primary 
        hover:!bg-primary hover:!text-white
        transition-all duration-300 ease-in-out `}>
          { content }
      </Button>
    </Link>
  )
}

export const SeeAll = ({ 
  border = 'primary',
  whiteBorder = false,
  cta = '/apartments/all',
  filterType,
  filterValue
}) => {
  // Build URL with query params for filtering
  const buildUrl = () => {
    if (!filterType) return cta;
    
    const url = new URL(cta, 'http://localhost');
    if (filterType) url.searchParams.set('filterType', filterType);
    if (filterValue) url.searchParams.set('filterValue', filterValue);
    return `${url.pathname}${url.search}`;
  };

  const resolvedBorder = whiteBorder ? 'white' : border
  const isWhiteBorder = resolvedBorder === 'white'

  return (
    <Link href={buildUrl()}>
      <Button
      variant="ghost"
      className={`
      ${isWhiteBorder ? "!border-white !text-white hover:!bg-white/10 hover:!border-white" : "!border-primary !text-white hover:!bg-secondary hover:!border-secondary"}  
      capitalize text-sm md:text-base tracking-wide !bg-primary 
      font-medium h-10 md:h-12 w-fit md:w-[10rem] rounded-full border 
      flex items-center gap-x-3 transition-all duration-300 ease-in-out`}>See All 
      <span className={`bg-white rounded-full ${isWhiteBorder ? 'text-primary' : 'text-secondary'} p-1`}>
      <GoArrowUpRight size={20}/></span></Button>
    </Link>
  )
}

export const UnlockBtn = ({text, className='', cta='/auth'}) => {
  return ( 
    <Link href={cta}>
      <Button className={`${className} capitalize bg-white rounded-full h-12 w-fit text-base font-semibold text-primary flex items-center gap-x-2 transition-all duration-300 ease-in-out hover:bg-primary hover:text-white`}>
        {text}
        <span className="bg-white rounded-full p-1 border border-primary">
          <GoArrowUpRight size={15} className="text-primary" />
        </span>
      </Button>
    </Link>
  )
}
