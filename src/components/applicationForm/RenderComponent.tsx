
import { Step } from './ApplicationForm'
import { useFormContextValues } from '@/hooks/useFormContextValues'
import { motion } from 'framer-motion'

const RenderComponent = ({steps}:{steps:Step[]}) => {
  const {currentPageIndex, delta} = useFormContextValues()
  const step = steps[currentPageIndex]
  const Component = step.component

  if(!Component) return null
  return (
    <motion.div
      key={currentPageIndex}
      initial={{ opacity: 0, x: delta > 0 ? "10%" : "-10%" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut", type: "tween" }}
      className="px-7 flex flex-col gap-y-4 flex-1"
    >
      <div>
        <h2 className="text-4xl font-bold tracking-tight leading-relaxed">
          {step.title}
        </h2>
        <p className="text-sm text-foreground/70">{step.description}</p>
      </div>
      {Component && <Component /> }
     
    </motion.div>
  )
}

export default RenderComponent