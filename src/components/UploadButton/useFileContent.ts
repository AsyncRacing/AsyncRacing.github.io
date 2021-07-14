import React, {
  Dispatch,
  SetStateAction,
  useState,
} from 'react';

interface fileDataType {
  file: null | File,
  text?: undefined | null | string,
}

// Create a file-reader helper function here.
const readFileData = (
  file: null | File,
  fileData: fileDataType = {file: null},
  setFileData: (fileData: any) => (void),
): void => {
  // Immediately clear the previous value for fileData.
  setFileData({file})

  // Use the "FileReader" JS Web API to read variables with type "File".
  const reader: FileReader = new FileReader()
  // Assign properties to various functions to execute onEvent.
  // This will set up the file reader for use.
  reader.onload = (onLoadEvent) => {
    // Ensure the event target...exists!
    if (onLoadEvent.target === null) {
      return
    }
    /*
      NOTE: TypeScript is giving an unneeded warning here.
      Because reader.onload will only ever run from reader.readAsText(),
      fileDataText will only ever end up being a string or null.
    */ // @ts-expect-error
    const fileDataText: string | null = onLoadEvent.target.result

    // Add the new information to fileData.
    setFileData({
      ...fileData,
      text: fileDataText,
    })
  }

  if (file !== null) {
    // Use the reader to obtain fileData as text.
    reader.readAsText(file)
  }
}

const useFileData = (
  defaultFile: null | File = null
): [
  fileDataType,
  Dispatch<SetStateAction<any>>,
] => {
  // Use react state for the hook!
  const [fileData, setFileData] = useState({file: null})

  // Integrate helper function into setState.
  const setFileDataByReading = (file: File | null) => {
    return readFileData(file, fileData, setFileData)
  }

  // // Re-Set the given default file.
  // setFileDataByReading(defaultFile) // ! Why does this make an error?
  return [fileData, setFileDataByReading]
}

export default useFileData;
