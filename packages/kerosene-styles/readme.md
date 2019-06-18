# 🔥 Kerosene-styles

```
yarn add @kablamo/kerosene-styles

npm install @kablamo/kerosene-styles
```

## Available SCSS

---

### [media.scss](scss/mixins/media.scss)

```scss
@import '~@kablamo/kablamo-styles/scss/mixins/media.scss';
```

#### Available Functions

#### `mq(width, type)`



Returns a media query based on a width, defined by a breakpoint, as well as the min or max type.

###### Example Usage

```scss
@include mq('desktop', max) {
    display: none;
}
```

###### Associated breakpoints

```scss
$breakpoints: (
    "phone":        400px,
    "phone-wide":   480px,
    "phablet":      560px,
    "tablet-small": 640px,
    "tablet":       768px,
    "tablet-wide":  1024px,
    "desktop":      1248px,
    "desktop-wide": 1440px
);
```

#### `aspect-ratio(width, height)`

Maintains the given ratio for the element it is included in.

###### Example Usage

```scss
@include aspect-ratio(16,9)
```

---

kablamo.com.au
