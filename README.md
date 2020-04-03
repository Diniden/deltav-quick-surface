# Quick Surface

This is a Surface type built on the deltav framework. The goal of this surface is to create a rapid prototyping system
that minimizes any complexity of getting a rendering surface working.

Essentially, this is a surface with a LOT of unmodifiable defaults that let's you use and work with existing deltav
layers and instances to output a graphic or result VERY easily.

One way of looking at it, is this is a `data-centric` Surface instead of a rendering pipeline focused system.

## Use

Using the QuickSurface is extremely easy:


```sh
npm install deltav-quick-surface
```

Then to use the surface:

```javascript
new QuickSurface({
  container: document.getElementById('main'),
  data: {
    circles: {
      large: [ new CircleInstance({...}) ],
      small: [ new CircleInstance({...}) ],
    },
    labels: {
      xAxis: [ new LabelInstance({...}) ],
      yAxis: [ new LabelInstance({...}) ],
    }
  }
})
```

And that's it!

The data object is ANY object structure who's leaves are lists of recognized Instances! The following is even valid:

```javascript
new QuickSurface({
  container: document.getElementById('main'),
  data: {
    circles: [ new CircleInstance({...}), ... ],
  }
})
```

As you can see: this is a Surface that is designed to get you rolling as quick as possible and STILL handle the hundreds
of thousands of points that the powerful deltav framework handles!

## Custom Views

You can customize views your data should appear in VERY easy. This example causes ALL circles to render within a custom
viewport:

```javascript
new QuickSurface({
  container: document.getElementById('main'),
  data: {
    circles: {
      large: [ new CircleInstance({...}) ],
      small: [ new CircleInstance({...}) ],
    },
    labels: {
      xAxis: [ new LabelInstance({...}) ],
      yAxis: [ new LabelInstance({...}) ],
    }
  },
  views: {
    circles: view({ viewport: {...} })
  }
})
```

Now the circles render in a new viewport while the labels will render in the default viewport. You can use this to
easily group and cluster instances as you see fit.

## Developing

```sh
npm run dev
```

## Unit Testing

```sh
npm run unit-test
```

## Developing Unit Tests

```sh
npm run unit-test-dev
```

## Releasing a new version

Make commits that include messages with the following format:

feature: new feature stuff
fixed: thing got fixed
task: get something done

Then when you have some valid features and fixes you run:

```sh
npm run release
```
