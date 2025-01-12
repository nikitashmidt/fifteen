const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 16;
const modal = document.querySelector('.modal');
const modalBtn = document.querySelector('.ok-button')

modalBtn.addEventListener('click', (e) => {
  modal.style.display = 'none'
})


if (itemNodes.length !== countItems) {
  throw new Error('Неверное количество элементов');
}

// Position
// Shuffle


// Change position by click
// Change position by keydown

// let matrix = getMatrix()
itemNodes[countItems - 1].style.display = 'none'

let matrix = getMatrix(itemNodes.map(item => +item.dataset.matrixId));

setPositionItem(matrix)

console.log(matrix)

document.getElementById('shuffle').addEventListener('click', () => {
  const shuffledArray = shuffleArray(matrix.flat())
  matrix = getMatrix(shuffledArray)
  setPositionItem(matrix)
})

const blankNumber = 16;

containerNode.addEventListener('click', (e) => {
  const buttonNode = e.target.closest('.item')

  if (!buttonNode) return

  const buttonNumber = +buttonNode.dataset.matrixId

  const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix)
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix)

  const isValid = isValidForSwap(buttonCoords, blankCoords)

  console.log(isValid)

  if (isValid) {
    swap(blankCoords, buttonCoords, matrix)
    setPositionItem(matrix)
  }
})


window.addEventListener('keydown', (event) => {
  const key = event.key

  if (!event.key.includes('Arrow')) return

  const blankCoords = findCoordinatesByNumber(blankNumber, matrix)
  const buttonCoords = {
    x: blankCoords.x,
    y: blankCoords.y
  }
  const maxIndexMatrix = matrix.length

  const direction = event.key.split('Arrow')[1].toLocaleLowerCase()

  switch (direction) {
    case 'up':
      buttonCoords.y += 1
      break

    case 'down':
      buttonCoords.y -= 1
      break
    case "left":
      buttonCoords.x += 1
      break
    case 'right':
      buttonCoords.x -= 1
      break

    default:
      break
  }

  if (buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0
    || buttonCoords.x >= maxIndexMatrix || buttonCoords.x < 0) return


  swap(blankCoords, buttonCoords, matrix)
  setPositionItem(matrix)

})

// helpers

function getMatrix(arr) {
  const matrix = [[], [], [], []];
  let y = 0
  let x = 0

  for (let i = 0; i < arr.length; i++) {
    // console.log('y', y, 'x', x)
    if (x >= 4) {
      y++
      x = 0
    }
    matrix[y][x] = arr[i]
    x++
  }

  return matrix
}


function setPositionItem(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const item = itemNodes[matrix[y][x] - 1]
      setNodeStyles(item, x, y)
    }
  }
}

function setNodeStyles(node, x, y) {
  const shiftPs = 100;

  node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`
}

function shuffleArray(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}


function findCoordinatesByNumber(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return { x, y }
      }
    }
  }

  return null
}

function isValidForSwap(coords1, coords2) {

  const diffX = Math.abs(coords1.x - coords2.x)
  const diffY = Math.abs(coords1.y - coords2.y)

  return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y)
}


function swap(coords1, coords2, matrix) {
  const coords1Number = matrix[coords1.y][coords1.x]
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x]
  matrix[coords2.y][coords2.x] = coords1Number

  if (isWon(matrix)) {
    addWonClass()
  }
}

const winFlatArray = new Array(16).fill(0).map((_, index) => index + 1)

function isWon(matrix) {

  const flatMatrix = matrix.flat()

  for (let i = 0; i < flatMatrix.length; i++) {
    if (flatMatrix[i] !== winFlatArray[i]) {
      return false
    }
  }

  return true

}

const wonClass = 'fifteenWon'

function addWonClass() {
  setTimeout(() => {
    containerNode.classList.add(wonClass)

    modal.style.display = 'block'

    setTimeout(() => {
      containerNode.classList.remove(wonClass)
    }, 1000)
  }, 200)
}