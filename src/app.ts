let password = "acb"
const alphabetLower = "abcdefghijklmnopqrstuvwxyz"
const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numbers = "0123456789"
const guessLetterList = alphabetLower + alphabetUpper + numbers
const base = guessLetterList.length
type PasswordGuessFnc = (data:number[]) => Promise<boolean>

const timeConsumeTask = async(_password:string) =>{
    if(password === _password){
        console.log("Password is", _password)
        return true
    }
    return false
}
const _convertWordsToPassword = (_words:number[]) =>{
    let _password = ""
    for (let i = 0; i < _words.length; i++) {
        _password += guessLetterList[_words[i]]
    }
    return _password
}

const guessPassword:PasswordGuessFnc= async (_words:number[]) =>{
    let _password = _convertWordsToPassword(_words)
    return await timeConsumeTask(_password)
}

const BruteForce = async (_baseDigit:number, passwordGuessFnc:PasswordGuessFnc) => {
    console.log("passwordGuessFnc", passwordGuessFnc)
	console.log("guessLetterList", guessLetterList)
	console.log("base", base)

    let isFinish = false
	let minWidth = 3
	let maxWidth = 3

	for (
		let totalCharacters = minWidth;
		totalCharacters <= maxWidth;
		totalCharacters++
	) {
		// totalCharacters is number of character to guess
		let words = new Array(totalCharacters).fill(0)
		console.log("totalCharacters", totalCharacters)
        
		const loop = async (_totalDigit: number, _currentDigit: number, _base:number) => {
			for (let i = 0; i < _base; i++) {
                words[_currentDigit] = i

				if (_currentDigit < _totalDigit - 1) {
                    // console.log("start loop ",  _currentDigit + 1);
                    
					await loop(_totalDigit, _currentDigit + 1, _base)
                    // console.log("end loop ",  _currentDigit + 1);
                    // console.log("Before clear words", words);
                    words.fill(0, _currentDigit + 1)
                    // console.log("After clear words", words);
				}else{
                    // guess password here
                    let tempPassword = _convertWordsToPassword(words)
                    console.log(words, tempPassword)
                    const result = await passwordGuessFnc(words)
                    if(result){
                        console.log("Finish")
                        isFinish = true
                    }
                    // console.log(`result ${tempPassword}: `, result)
                }
                if(isFinish){
                    break
                }
			}
		}
		await loop(totalCharacters, 0, _baseDigit)
	}
    !isFinish && console.log("Brute Force Failed")
}

console.time("BruteForce")
BruteForce(base, guessPassword)
console.timeEnd("BruteForce")