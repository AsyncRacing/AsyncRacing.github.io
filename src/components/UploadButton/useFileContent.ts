import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

// Create a file-reader helper function here.
const readFileContent = (
  file: File | null = null,
  setFileContent: Dispatch<SetStateAction<string | null>>
) => {
  // Use the "FileReader" JS Web API to read variables with type "File".
  const reader: FileReader = new FileReader();
  // Assign properties to various functions to execute onEvent.
  // This will set up the file reader for use.
  reader.onload = (onLoadEvent) => {
    // Ensure the event target...exists!
    if (onLoadEvent.target === null) {
      return;
    }

    // Gather the file's text content and then set it.
    const fileContent: string | null = onLoadEvent.target.result as
      | string
      | null;
    setFileContent(fileContent);
  };

  if (file !== null) {
    // Use the reader to obtain fileData as text.
    reader.readAsText(file);
  }
};

const useFileContent = (file: File | null = null): string | null => {
  // Use react state for the hook!
  const [fileContent, setFileContent] = useState<string | null>(null);

  // Use react effect hooks as well for watching changes.
  // This enables more declaritive programming styles.
  useEffect(() => {
    readFileContent(file, setFileContent);
  }, [file]);

  // Return the fileContent value only, as its hooked into useEffect.
  return fileContent;
};

export { useFileContent };
