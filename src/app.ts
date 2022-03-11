
let password = "aasad"
const alphabetLower = "abcdefghijklmnopqrstuvwxyz"
const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numbers = "0123456789"
const guessLetterList = alphabetLower + alphabetUpper + numbers

type PasswordGuessFnc = (data: number[]) => Promise<boolean>

const timeConsumeTask = async (_password: string) => {
	if (password === _password) {
		console.log("Password is", _password)
		return true
	}
	return false
}
const _convertWordsToPassword = (_words: number[]) => {
	let _password = ""
	for (let i = 0; i < _words.length; i++) {
		_password += guessLetterList[_words[i]]
	}
	return _password
}

const guessPassword: PasswordGuessFnc = async (_words: number[]) => {
	let _password = _convertWordsToPassword(_words)
	return await timeConsumeTask(_password)
}

interface BruteForceCoreOptions {
	wordRef: number[]
	letterList: string
	minLength: number
	maxLength: number
	passwordGuessFnc: PasswordGuessFnc
}
const BruteForce = async (options: BruteForceCoreOptions) => {
	const { letterList, minLength, maxLength, passwordGuessFnc } = options

	console.log("letterList", letterList)
	const baseDigit = letterList.length
	console.log("baseDigit", baseDigit)

	let isFinish = false

	// check length
	if (minLength < 1 || maxLength < 1 || maxLength < minLength) {
		throw Error("Length error")
	}
	for (
		let totalCharacters = minLength;
		totalCharacters <= maxLength;
		totalCharacters++
	) {
		//break when finish
		if (isFinish) {
			break
		}

		// totalCharacters is number of character to guess
		options.wordRef = new Array(totalCharacters).fill(0)
		console.log("totalCharacters", totalCharacters)

		const loop = async (
			_totalDigit: number,
			_currentDigit: number,
			_base: number,
		) => {
			for (let i = 0; i < _base; i++) {
				options.wordRef[_currentDigit] = i

				if (_currentDigit < _totalDigit - 1) {
					// console.log("start loop ",  _currentDigit + 1);

					await loop(_totalDigit, _currentDigit + 1, _base)
					// console.log("end loop ",  _currentDigit + 1);
					// console.log("Before clear words", words);
					options.wordRef.fill(0, _currentDigit + 1)
					// console.log("After clear words", words);
				} else {
					// guess password here
					const result = await passwordGuessFnc(options.wordRef)
					if (result) {
						console.log("Finish")
						isFinish = true
					}
					// console.log(`result ${tempPassword}: `, result)
				}
				if (isFinish) {
					break
				}
			}
		}
		await loop(totalCharacters, 0, baseDigit)
	}
	!isFinish && console.log("Brute Force Failed")
}

const main = async () => {
	console.time("BruteForce")
	let wordRef: number[] = []
	// setInterval(() => {
	// 	console.log("wordRef", wordRef)
	// }, 1 * 1000)
	await BruteForce({
		wordRef,
		letterList: guessLetterList,
		minLength: 3,
		maxLength: 5,
		passwordGuessFnc: guessPassword,
	})
	console.timeEnd("BruteForce")
}

main()


// const NewMain = () =>{
//     const worker = new Worker()
// }