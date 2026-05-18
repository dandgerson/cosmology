import ThemeSwitcher from '../components/ThemeSwitcher'
import Presentation from '../components/Presentation'

export default function RootLayout() {
  return (
    <div className="relative size-full [height:100dvh]">
      <ThemeSwitcher />
      <p
        className="pointer-events-none fixed bottom-32 left-1/2 z-40 hidden -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70 mobile-deck:block"
        aria-hidden="true"
      >
        Свайп: влево/вправо — слайды, вверх/вниз — разделы
      </p>
      <Presentation />
    </div>
  )
}
