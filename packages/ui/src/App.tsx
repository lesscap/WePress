import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { EditorLayout } from './app/layout/editor-layout'
import { OnboardingPage } from './app/onboarding-page'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/editor" element={<EditorLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
