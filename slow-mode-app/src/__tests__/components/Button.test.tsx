import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'
import { describe, it } from 'node:test'
import { expect } from '@playwright/test'

describe('Button Component', () => {
  it('affiche correctement le texte du bouton', () => {
    render(<Button>Cliquez-moi</Button>)
    expect(screen.getByText('Cliquez-moi')).toBeInTheDocument()
  })

  it('applique la classe CSS fournie', () => {
    render(<Button className="btn-primary">Test</Button>)
    const button = screen.getByText('Test')
    expect(button).toHaveClass('btn-primary')
  })
})