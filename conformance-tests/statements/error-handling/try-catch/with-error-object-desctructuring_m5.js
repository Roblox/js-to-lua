try {
  throw(new Error("kaboom"))
} catch({message}) {
  console.log(message)
}
