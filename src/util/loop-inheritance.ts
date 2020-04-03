/**
 * This will return the class an object inherits or is an instance of and continue up the chain of inheritance until
 * a null value for the inherited class is found. This can be early exited by returning 'true' indicating the needed
 * inherited element is found.
 */
export function loopInheritance<T>(
  obj: T,
  callback: (base: Function | object) => boolean | void
) {
  let baseClass = Object.getPrototypeOf(obj);

  while (baseClass !== null) {
    const quit = callback(
      baseClass.constructor ? baseClass.constructor : baseClass
    );
    if (quit) break;
    baseClass = Object.getPrototypeOf(baseClass);
  }
}
