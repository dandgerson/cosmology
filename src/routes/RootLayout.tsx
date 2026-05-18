import ThemeSwitcher from '../components/ThemeSwitcher'
import Presentation from '../components/Presentation'

export default function RootLayout() {
  return (
    <div className="deck-shell">
      <ThemeSwitcher />
      <p className="mobile-nav-hint" aria-hidden="true">
        Свайп: влево/вправо — слайды, вверх/вниз — разделы
      </p>
      <Presentation />
    </div>
  )
}
