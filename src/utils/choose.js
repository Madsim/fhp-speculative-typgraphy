// Picks one of two values without a ternary: early return keeps the control flow flat.
const choose = (condition, whenTrue, whenFalse) => {
  if (condition) return whenTrue
  return whenFalse
}

export default choose
