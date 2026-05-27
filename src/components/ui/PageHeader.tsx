import { useTheme } from '../../contexts/ThemeContext'
import RequestButton from './RequestButton'
interface Props { title:string; subtitle?:string; icon?:string; page?:string; image?:string }
export default function PageHeader({ title, subtitle, icon, page, image }:Props) {
  const { theme } = useTheme()
  return (
    <div className="relative overflow-hidden rounded-xl mb-6 min-h-[80px]" style={{background:theme.bgLight}}>
      {image && <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-20" alt=""/>}
      <div className="relative z-10 p-5 flex items-start justify-between">
        <div><div className="flex items-center gap-2 mb-0.5">{icon&&<span className="text-2xl">{icon}</span>}<h1 className="font-bebas text-3xl tracking-wider" style={{color:theme.accent}}>{title}</h1></div>{subtitle&&<p className="text-xs text-gray-400">{subtitle}</p>}</div>
        {page&&<RequestButton page={page}/>}
      </div>
    </div>
  )
}