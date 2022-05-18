import { render } from '@testing-library/react'
import Explainer from '../Explainer'
import * as hooks from '../../../hooks'

describe('Component: Explainer', () => {
  test('should render the component with app title', () => {
    jest.spyOn(hooks, 'useFCL').mockImplementation(() => {
      return {
        appConfig: {
          title: 'Test App',
        },
      }
    })

    const { container } = render(<Explainer />)
    expect(container.firstChild).toMatchSnapshot()
  })

  test('should render app as unknown in Explainer component if no title', () => {
    jest.spyOn(hooks, 'useFCL').mockImplementation(() => {
      return {
        appConfig: {
          title: null,
        },
      }
    })

    const { container } = render(<Explainer />)
    expect(container.firstChild).toMatchSnapshot()
  })
})