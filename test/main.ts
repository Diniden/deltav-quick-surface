import { QuickSurface } from '../src';

async function start() {
  const container = document.getElementById("main");
  if (!container) return;

  new QuickSurface({
    container
  });
}

start();
