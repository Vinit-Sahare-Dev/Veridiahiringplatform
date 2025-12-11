# CSS Optimization Guide

## Overview
This guide provides best practices for managing CSS in the Veridia Hiring Platform.

## File Structure

### Optimized CSS Files
- `main.css` - Entry point with organized imports
- `variables-optimized.css` - Design system variables
- `base-optimized.css` - Foundation styles
- `utilities.css` - Common utility classes

### Page-Specific Styles
- `CareersEnhanced.css` - Careers page styling
- `Applications.css` - Application forms
- `AdminDashboard.css` - Admin interface
- `auth.css` - Authentication pages

## Best Practices

### 1. Use CSS Variables
```css
/* Good */
.card {
  padding: var(--card-padding);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
}

/* Avoid */
.card {
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

### 2. Organize Imports
```css
/* Order: Variables → Base → Layout → Pages → Components → Utilities */
@import './variables.css';
@import './base.css';
@import './layout.css';
@import './pages/home.css';
@import './components/buttons.css';
@import './utilities.css';
```

### 3. Use Utility Classes
```html
<!-- Good -->
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

<!-- Avoid -->
<div class="custom-card-component">
```

### 4. Component-Based Styling
```css
/* Component-specific styles */
.careers-hero {
  /* Component styles */
}

.careers-hero__title {
  /* Element styles */
}

.careers-hero--featured {
  /* Modifier styles */
}
```

## Performance Tips

### 1. Minimize CSS Bloat
- Remove unused CSS rules
- Avoid overly specific selectors
- Use efficient selectors

### 2. Critical CSS
- Load above-the-fold styles first
- Defer non-critical CSS
- Use media queries for conditional loading

### 3. CSS Compression
- Minify CSS in production
- Remove comments and whitespace
- Optimize shorthand properties

## Responsive Design

### Breakpoint Variables
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Mobile-First Approach
```css
/* Base styles (mobile) */
.container {
  padding: 1rem;
}

/* Desktop overrides */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
  }
}
```

## Color System

### Semantic Colors
```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### Accessibility
- Ensure 4.5:1 contrast ratio for text
- Use semantic colors for meaning
- Support high contrast mode

## Animation Guidelines

### Performance
- Use `transform` and `opacity` for animations
- Avoid animating layout properties
- Respect `prefers-reduced-motion`

### Consistent Timing
```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}
```

## Maintenance

### 1. Regular Cleanup
- Review and remove unused styles
- Consolidate duplicate rules
- Update variable references

### 2. Documentation
- Document complex components
- Explain design decisions
- Maintain style guide

### 3. Code Review
- Check for consistency
- Validate accessibility
- Test across browsers

## Migration Strategy

### Phase 1: Setup
1. Create optimized variable system
2. Set up utility classes
3. Establish base styles

### Phase 2: Component Migration
1. Update existing components
2. Remove duplicate styles
3. Implement design tokens

### Phase 3: Optimization
1. Remove old CSS files
2. Optimize bundle size
3. Test performance

## Tools and Resources

### Development Tools
- CSS Variables inspector
- Performance profiler
- Accessibility checker

### Build Tools
- CSS minification
- PurgeCSS for unused styles
- PostCSS for optimization

### Validation
- W3C CSS Validator
- Accessibility testing
- Cross-browser testing

## Troubleshooting

### Common Issues
1. **Specificity Conflicts** - Use consistent naming conventions
2. **Variable Scope** - Define variables in :root
3. **Responsive Breaks** - Test at all breakpoints
4. **Performance** - Minimize CSS size and complexity

### Debugging Tips
- Use browser dev tools
- Check CSS cascade order
- Validate HTML structure
- Test with different content

## Future Considerations

### CSS-in-JS Evaluation
- Assess component styling needs
- Consider performance impact
- Evaluate developer experience

### Design System Evolution
- Expand variable system
- Add component libraries
- Document design patterns

### Performance Monitoring
- Track CSS bundle size
- Monitor load times
- Optimize delivery
