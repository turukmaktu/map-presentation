import ForceMeter from './components/ForceMeter'
import About from './sections/About'
import Cta from './sections/Cta'
import DarkSide from './sections/DarkSide'
import Feedback from './sections/Feedback'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import JediPath from './sections/JediPath'
import LiveDemo from './sections/LiveDemo'
import ProblemSolution from './sections/ProblemSolution'
import Savings from './sections/Savings'
import TechStack from './sections/TechStack'

export default function App() {
  return (
    <>
      <ForceMeter />
      <Hero />
      <main>
        <ProblemSolution />
        <JediPath />
        <TechStack />
        <Savings />
        <LiveDemo />
        <About />
        <DarkSide />
        <Cta />
        <Feedback />
      </main>
      <Footer />
    </>
  )
}
