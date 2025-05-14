# Grand Notifications

Beautiful, customizable toast notifications with artistic animations.

## Installation

Install the package via npm:

```bash
npm install grand-notifications
```


## Demo

**<a href="https://rishi-rj-s.github.io/grand-notifications/" target="_blank" rel="noopener noreferrer">View Live Demo</a>**


## Usage

Import the `showToast` function and the library's CSS into your project:

```javascript
import { showToast } from 'grand-notifications';
import 'grand-notifications/grand-notifications.css';
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
| `showProgress` | Boolean   | `true`       | Whether to show a progress bar indicating the toast's duration             |
| `color`        | String    | Type-based    | Custom text color for the toast (CSS value, e.g., `'#ffffff'` or `'rgb(255, 255, 255)'`) |
| `speed`        | Number    | `1`           | Animation speed multiplier (higher numbers = faster animations)            |
| `position`     | String    | `'top-right'` | Position of the toast: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`, `'top-center'`, `'bottom-center'`, `'middle'` |

#### Framework Compatibility

### React
In React, use `showToast` inside a `useEffect` hook to avoid DOM manipulation issues:

```javascript
import { showToast } from 'grand-notifications';
import 'grand-notifications/grand-notifications.css';
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

### Angular
Ensure `showToast` is called after the DOM is fully rendered (e.g., in `onMounted` for Vue or `ngAfterViewInit` for Angular).  
First, add the CSS to your angular.json:

```json
"styles": [
  "node_modules/grand-notifications/dist/grand-notifications.css",
  "src/styles.css"
]
```

Create a service (recommended):

```typescript
// notification.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { showToast } from 'grand-notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  showSuccess(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      showToast({ type: 'success', message });
    }
  }

  showError(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      showToast({ type: 'error', message, duration: 5000 });
    }
  }
  
  // Advanced Example
  showCustomToast(title: string, message: string, bg: string, icon: string) {
    if (isPlatformBrowser(this.platformId)) {
      showToast({
       title,
       message,
       background: bg,
       icon,
       type: 'custom',
       showProgress: true,
       duration: 8000
      });
     }
    }
}
```

Use in components:  

```typescript
// app.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  template: `<button (click)="showToast()">Trigger Toast</button>`
})
export class AppComponent implements AfterViewInit {
  constructor(private notifications: NotificationService) {}

  ngAfterViewInit() {
    this.notifications.showSuccess('App loaded!');
  }

  showToast() {
    this.notifications.showError('Something went wrong!');

    // Advanced calls
    this.notifications.showCustomToast(
      'Update Available',
      'Restart to install v2.0',
      'linear-gradient(to right, #ff8a00, #da1b60)',
      '✨'
    );

  }
}
```

### Vue

```javascript
<script setup>
import { onMounted } from 'vue';
import { showToast } from 'grand-notifications';
import 'grand-notifications/grand-notifications.css';

onMounted(() => {
  showToast({ 
    type: 'success', 
    message: 'Vue app mounted!',
    entranceAnim: 'bounce'
  });
});
</script>
```

### Examples with New Options

```javascript
// Custom positioning
showToast({
  type: 'success',
  message: 'Toast at the bottom center',
  position: 'bottom-center'
});

// Custom text color
showToast({
  type: 'info',
  message: 'Toast with custom text color',
  color: '#ff5722'
});

// Custom animation speed
showToast({
  type: 'warning',
  message: 'Toast with faster animations',
  speed: 1.5,
  entranceAnim: 'bounce',
  exitAnim: 'pixel'
});

// Combining multiple customizations
showToast({
  type: 'custom',
  title: 'Complete Customization',
  message: 'Customize everything at once!',
  background: 'linear-gradient(45deg, #673ab7, #3f51b5)',
  color: '#ffffff',
  position: 'middle',
  speed: 0.8,
  icon: '🎮',
  showProgress: true
});
```

## Customization

You can customize the appearance of toasts by overriding the CSS variables defined in `styles.css`:

```css
:root {
    --toast-max-width: 400px;
    --toast-border-radius: 8px;
    --toast-padding: 1.2rem;
}
```

## Why Choose Grand Notifications?

### Effortless Integration
- **✨ Framework-agnostic** - Works seamlessly with React, Angular, Vue, or vanilla JavaScript
- **🔌 Zero dependencies** - Lightweight with no external requirements
- **⚡ Simple API** - Start showing beautiful notifications with just one function call

### Beautiful Presentation
- **🎭 Rich animations** - Choose from 5+ entrance and exit animations including slide, bounce, fade, melt, pixel, and hologram effects
- **🎨 Fully customizable** - Personalize colors, backgrounds, icons, timing, and more
- **📱 Responsive design** - Looks great on any device or screen size

### Enhanced User Experience
- **⏱️ Progress indicator** - Optional visual timer shows users how long notifications will remain
- **🔔 Multiple notification types** - Success, error, info, warning, and custom styles built in
- **🧩 TypeScript support** - Full type definitions for improved developer experience
- **🧭 Flexible positioning** - Place your toasts in any corner or center of the screen

### Performance Focused
- **🚀 Optimized rendering** - Minimal DOM impact with efficient animations
- **🔄 Smart queuing** - Properly handles multiple notifications without overwhelming users
- **🛡️ Accessibility compliant** - Designed with WCAG guidelines in mind

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.