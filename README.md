# Grand Notifications

Beautiful, customizable toast notifications with artistic animations.

## Installation

Install the package via npm:

```bash
npm install grand-notifications
```

## Usage

Import the `showToast` function and the library's CSS into your project:

```javascript
import { showToast } from 'grand-notifications';
import 'grand-notifications/styles.css';
```

Call `showToast` with an options object to display a toast notification:

```javascript
// Basic success toast
showToast({
    type: 'success',
    message: 'Operation completed successfully!'
});
```

## API

### `showToast(options)`

Display a toast notification with customizable options.

#### Parameters

- `options` (optional): An object containing the following properties:

| Property       | Type      | Default       | Description                                                                 |
|----------------|-----------|---------------|-----------------------------------------------------------------------------|
| `type`         | String    | `'success'`   | The type of toast: `'success'`, `'error'`, `'info'`, `'warning'`, `'custom'` |
| `entranceAnim` | String    | `'slide'`     | Entrance animation: `'slide'`, `'bounce'`, `'fade'`                        |
| `exitAnim`     | String    | `'melt'`      | Exit animation: `'melt'`, `'pixel'`, `'hologram'`                          |
| `duration`     | Number    | `3000`        | Duration in milliseconds before the toast auto-dismisses                   |
| `icon`         | String    | Type-based    | Custom icon (emoji or HTML) to display in the toast                        |
| `closable`     | Boolean   | `true`        | Whether the toast has a close button                                       |
| `message`      | String    | Type-based    | Custom message for the toast                                               |
| `title`        | String    | `undefined`   | Optional title for the toast                                               |
| `background`   | String    | Type-based    | Custom background (CSS value, e.g., `'linear-gradient(135deg, #8E2DE2, #4A00E0)'`) |
| `showProgress` | Boolean   | `false`       | Whether to show a progress bar indicating the toast's duration             |

#### Examples

```javascript
// Success toast with custom message
showToast({
    type: 'success',
    message: 'Custom success message!'
});

// Toast with title and message
showToast({
    type: 'info',
    title: 'Important Message',
    message: 'This toast includes both a title and message.',
    duration: 5000
});

// Long-duration toast with progress bar
showToast({
    type: 'warning',
    message: 'This toast will stay visible for 8 seconds.',
    duration: 8000,
    showProgress: true,
    exitAnim: 'pixel'
});

// Toast without close button
showToast({
    type: 'error',
    message: 'This toast has no close button.',
    closable: false,
    entranceAnim: 'fade',
    exitAnim: 'hologram'
});

// Toast with custom background
showToast({
    message: 'Custom gradient background toast.',
    background: 'linear-gradient(135deg, #8E2DE2, #4A00E0)',
    icon: '🎨'
});
```

## Framework Compatibility

### React
In React, use `showToast` inside a `useEffect` hook to avoid DOM manipulation issues:

```javascript
import { showToast } from 'grand-notifications';
import 'grand-notifications/styles.css';
import { useEffect } from 'react';

function App() {
    useEffect(() => {
        showToast({
            type: 'success',
            message: 'Welcome to the app!'
        });
    }, []);

    return <div>Your app content</div>;
}

export default App;
```

### Vue/Angular
Ensure `showToast` is called after the DOM is fully rendered (e.g., in `onMounted` for Vue or `ngAfterViewInit` for Angular).

## Customization

You can customize the appearance of toasts by overriding the CSS variables defined in `styles.css`:

```css
:root {
    --toast-max-width: 400px;
    --toast-border-radius: 8px;
    --toast-padding: 1.2rem;
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.