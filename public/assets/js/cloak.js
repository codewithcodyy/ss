
let inFrame

try {
    inFrame = window !== top
} catch (e) {
    inFrame = true
}

