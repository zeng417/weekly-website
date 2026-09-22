import DefaultTheme from 'vitepress/theme'
import './custom.css'
import WeeklyCards from './components/WeeklyCards.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('WeeklyCards', WeeklyCards)
  }
}
