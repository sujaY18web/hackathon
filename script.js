// List of suspicious file extensions and size limits
const suspiciousExtensions = ['.exe', '.bat', '.vbs', '.scr', '.js'];
const safeExtensions = ['.txt', '.pdf', '.jpg', '.png', '.docx'];

// Handle file upload and checks
document.getElementById("upload-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const resultDiv = document.getElementById("result");

    // Clear previous results
    resultDiv.innerHTML = "";

    if (!fileInput.files.length) {
        displayResult("Please select a file.", true);
        return;
    }

    // Loop through selected files
    for (let file of fileInput.files) {
        const extensionResult = checkFileExtension(file);
        const sizeResult = checkFileSize(file);
        const finalResult = checkFileSafety(extensionResult, sizeResult);

        // Display result for each file
        const resultMessage = document.createElement("div");
        resultMessage.classList.add("result-message", finalResult.class);
        resultMessage.textContent = `${file.name}: ${finalResult.message}`;
        resultDiv.appendChild(resultMessage);
    }
});

// Check file extension for suspicious types
function checkFileExtension(file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (suspiciousExtensions.includes('.' + fileExtension)) {
        return "unsafe";
    }
    if (!safeExtensions.includes('.' + fileExtension)) {
        return "warning";
    }
    return "safe";
}

// Check file size (limit 5 KB to 100 MB)
function checkFileSize(file) {
    const fileSize = file.size;
    if (fileSize < 5 * 1024) {
        return "unsafe"; // Too small to be safe
    }
    if (fileSize > 100 * 1024 * 1024) {
        return "unsafe"; // Too large
    }
    return "safe";
}

// Determine final safety status
function checkFileSafety(extensionResult, sizeResult) {
    if (extensionResult === "unsafe" || sizeResult === "unsafe") {
        return { message: "Unsafe file", class: "unsafe" };
    }
    if (extensionResult === "warning" || sizeResult === "warning") {
        return { message: "Warning: Uncommon file", class: "warning" };
    }
    return { message: "Safe file", class: "safe" };
}

// Display result with animation
function displayResult(message, isError = false) {
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = message;
    resultDiv.classList.toggle("error", isError);
}
