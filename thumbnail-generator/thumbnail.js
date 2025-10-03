/* auth-system/thumbnail.js */

const previewArea = document.getElementById('imagePreview');
const resultImage = document.getElementById('resultImage');
const canvasWrapper = document.getElementById('canvasWrapper');
const titleInput = document.getElementById('title');
const logoFileInput = document.getElementById('logoFile');
const logoUrlInput = document.getElementById('logoUrl');
const logoImage = document.getElementById('logoImage');
const downloadBtn = document.getElementById('downloadBtn');
const addTextBtn = document.getElementById('addTextBtn');

let currentTextElement = null;
let textCounter = 1;
let initialMouseX, initialMouseY, initialTextX, initialTextY;

// --- 1. General & Utility Functions ---

function applySettings() {
    const canvasWidth = document.getElementById('canvasWidth').value + 'px';
    const canvasHeight = document.getElementById('canvasHeight').value + 'px';
    const backgroundColor = document.getElementById('bgColor').value;
    const padding = document.getElementById('padding').value + 'px';
    const borderRadius = document.getElementById('borderRadius').value + 'px';
    const backgroundOpacity = document.getElementById('bgOpacity').value / 100;

    canvasWrapper.style.width = canvasWidth;
    canvasWrapper.style.height = canvasHeight;
    canvasWrapper.style.padding = padding;
    canvasWrapper.style.borderRadius = borderRadius;
    canvasWrapper.style.backgroundColor = backgroundColor;
    canvasWrapper.style.opacity = backgroundOpacity;

    // Update text elements colors and fonts
    document.querySelectorAll('.text-element').forEach(el => {
        if (el.dataset.type === 'mainTitle') {
            el.style.fontSize = document.getElementById('titleSize').value + 'px';
            el.style.color = document.getElementById('titleColor').value;
            el.style.fontWeight = document.getElementById('titleWeight').value;
            el.style.lineHeight = document.getElementById('titleLineHeight').value;
            el.style.fontFamily = document.getElementById('titleFont').value;
        } else if (el.dataset.type === 'customText') {
            el.style.fontSize = document.getElementById('textSize').value + 'px';
            el.style.color = document.getElementById('textColor').value;
            el.style.fontWeight = document.getElementById('textWeight').value;
            el.style.lineHeight = document.getElementById('textLineHeight').value;
            el.style.fontFamily = document.getElementById('textFont').value;
        }
    });

    // Update logo settings
    const logoSize = document.getElementById('logoSize').value + 'px';
    logoImage.style.width = logoSize;
    logoImage.style.height = logoSize;
    logoImage.style.borderRadius = document.getElementById('logoRadius').value + 'px';
    logoImage.style.opacity = document.getElementById('logoOpacity').value / 100;
}

function setActiveTab(tabIndex) {
    document.querySelector('.settings-tabs').setAttribute('data-active-tab', tabIndex);
}

function setupDraggable(element) {
    const startDrag = (e) => {
        e.preventDefault();
        
        // Remove selection from all other text elements
        document.querySelectorAll('.text-element').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        currentTextElement = element;

        // Get initial mouse and element positions
        initialMouseX = e.clientX || e.touches[0].clientX;
        initialMouseY = e.clientY || e.touches[0].clientY;
        
        const rect = element.getBoundingClientRect();
        const wrapperRect = canvasWrapper.getBoundingClientRect();

        // Calculate initial text position relative to the wrapper
        // The element is centered using transform: translate(-50%, -50%)
        // So rect.left is the left edge, but we need the center point.
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        initialTextX = elementCenterX - wrapperRect.left;
        initialTextY = elementCenterY - wrapperRect.top;

        document.addEventListener('mousemove', drag, false);
        document.addEventListener('mouseup', stopDrag, false);
        document.addEventListener('touchmove', drag, false);
        document.addEventListener('touchend', stopDrag, false);
    };

    const drag = (e) => {
        e.preventDefault();
        if (!currentTextElement) return;

        const currentMouseX = e.clientX || e.touches[0].clientX;
        const currentMouseY = e.clientY || e.touches[0].clientY;
        
        const dx = currentMouseX - initialMouseX;
        const dy = currentMouseY - initialMouseY;
        
        let newX = initialTextX + dx;
        let newY = initialTextY + dy;

        // Convert to percentage relative to canvasWrapper
        const wrapperWidth = canvasWrapper.clientWidth;
        const wrapperHeight = canvasWrapper.clientHeight;

        let newXPercentage = (newX / wrapperWidth) * 100;
        let newYPercentage = (newY / wrapperHeight) * 100;

        // Apply new position
        currentTextElement.style.left = `${newXPercentage}%`;
        currentTextElement.style.top = `${newYPercentage}%`;
    };

    const stopDrag = () => {
        document.removeEventListener('mousemove', drag, false);
        document.removeEventListener('mouseup', stopDrag, false);
        document.removeEventListener('touchmove', drag, false);
        document.removeEventListener('touchend', stopDrag, false);
    };

    element.addEventListener('mousedown', startDrag, false);
    element.addEventListener('touchstart', startDrag, false);
    
    // Double click to edit or delete
    element.addEventListener('dblclick', (e) => {
        if (e.target.closest('.text-element')) {
            editText(element);
        }
    });
}

function editText(element) {
    const currentText = element.innerText;
    const newText = prompt("تعديل النص:", currentText);
    if (newText !== null && newText.trim() !== "") {
        element.innerText = newText.trim();
        element.dataset.text = newText.trim();
    } else if (newText === "") {
        if (confirm("هل تريد حذف هذا العنصر النصي؟")) {
            element.remove();
            currentTextElement = null;
        }
    }
}

// --- 2. Logo & Image Handling ---

function handleLogoFile() {
    if (logoFileInput.files.length > 0) {
        const file = logoFileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            logoImage.src = e.target.result;
            logoUrlInput.value = ''; // Clear URL input
        };
        reader.readAsDataURL(file);
    }
}

function handleLogoUrl() {
    const url = logoUrlInput.value.trim();
    if (url) {
        logoImage.src = url;
        logoFileInput.value = ''; // Clear file input
    }
}

// --- 3. Text Element Handling ---

function updateTitleElement() {
    let titleElement = document.querySelector('.text-element[data-type="mainTitle"]');
    const newTitle = titleInput.value.trim();

    if (!titleElement && newTitle) {
        titleElement = document.createElement('div');
        titleElement.className = 'text-element';
        titleElement.dataset.type = 'mainTitle';
        titleElement.dataset.text = newTitle;
        // Set initial position to the center (50% 50%)
        titleElement.style.left = '50%';
        titleElement.style.top = '50%';
        canvasWrapper.appendChild(titleElement);
        setupDraggable(titleElement);
    }

    if (titleElement) {
        titleElement.innerText = newTitle;
        titleElement.dataset.text = newTitle;
        if (!newTitle) {
            titleElement.remove();
        }
    }
    applySettings();
}

function addCustomText() {
    const initialText = prompt("أدخل النص المخصص:", `نص مخصص ${textCounter}`);
    if (initialText && initialText.trim() !== "") {
        const textElement = document.createElement('div');
        textElement.className = 'text-element';
        textElement.dataset.type = 'customText';
        textElement.dataset.text = initialText.trim();
        textElement.innerText = initialText.trim();
        textElement.id = `customText-${textCounter}`;
        
        // Initial position slightly offset from center
        textElement.style.left = '55%';
        textElement.style.top = '55%';

        canvasWrapper.appendChild(textElement);
        setupDraggable(textElement);
        applySettings();
        textCounter++;
    }
}

// --- 4. Download Functionality (Key Step) ---

function downloadThumbnail() {
    // 1. Unselect any text element
    if (currentTextElement) {
        currentTextElement.classList.remove('selected');
    }

    // 2. Temporarily apply max size/quality to canvas for capture
    const originalWidth = canvasWrapper.style.width;
    const originalHeight = canvasWrapper.style.height;
    
    // We use innerHTML and a hidden element to avoid conflicts with Blogger's post content CSS
    const tempCanvasWrapper = document.createElement('div');
    tempCanvasWrapper.innerHTML = canvasWrapper.innerHTML;
    tempCanvasWrapper.style.cssText = canvasWrapper.style.cssText;
    
    // Apply temporary high resolution styles (optional, but good practice)
    tempCanvasWrapper.style.width = document.getElementById('canvasWidth').value + 'px';
    tempCanvasWrapper.style.height = document.getElementById('canvasHeight').value + 'px';
    
    // Append to body temporarily to allow html2canvas to access computed styles
    document.body.appendChild(tempCanvasWrapper);

    // 3. Use html2canvas to capture the content
    html2canvas(tempCanvasWrapper, {
        scale: 3, // Increase scale for higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null // Keep transparent background if canvas is transparent
    }).then(canvas => {
        // 4. Create download link
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = 'modweeb-thumbnail.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 5. Cleanup
        document.body.removeChild(tempCanvasWrapper);
        if (currentTextElement) {
            currentTextElement.classList.add('selected'); // Re-select if necessary
        }
    }).catch(error => {
        console.error("Error during image capture:", error);
        alert('حدث خطأ أثناء إنشاء الصورة. تأكد من أن جميع الصور المحملة ليس لها قيود CORS.');
        document.body.removeChild(tempCanvasWrapper); // Ensure cleanup on error
    });
}

// --- 5. Event Listeners & Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Initial call to set default styles
    applySettings();

    // Event listeners for all input changes to update preview
    document.querySelectorAll('.input, .color-input input, input[type="range"], select').forEach(input => {
        input.addEventListener('input', applySettings);
    });

    // Specific listeners
    titleInput.addEventListener('input', updateTitleElement);
    logoFileInput.addEventListener('change', handleLogoFile);
    logoUrlInput.addEventListener('input', handleLogoUrl);
    downloadBtn.addEventListener('click', downloadThumbnail);
    addTextBtn.addEventListener('click', addCustomText);

    // Range input value display
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.addEventListener('input', function() {
            const valueSpan = document.getElementById(`${range.id}Value`);
            if (valueSpan) {
                valueSpan.textContent = `${range.value}${range.id.includes('Opacity') ? '%' : 'px'}`;
            }
        });
    });

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabId = e.currentTarget.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Accordion setup
    const accordionHeader = document.querySelector('.accordion__header');
    const accordionContent = document.querySelector('.accordion__content');
    if (accordionHeader && accordionContent) {
        accordionHeader.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            accordionContent.setAttribute('aria-hidden', isExpanded);
            if (isExpanded) {
                accordionContent.style.display = 'none';
            } else {
                accordionContent.style.display = 'block';
            }
        });
    }

    // Size controls (+/- buttons)
    document.querySelectorAll('.size-control__btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.dataset.action;
            const target = this.dataset.target;
            const valueElement = document.getElementById(`${target}Value`);
            const hiddenInput = document.getElementById(target);
            let currentSize = parseInt(valueElement.textContent);

            if (action === 'increase') {
                currentSize += 1;
            } else {
                currentSize = Math.max(1, currentSize - 1);
            }

            valueElement.textContent = currentSize + 'px';
            hiddenInput.value = currentSize;
            applySettings(); // Update preview after change
        });
    });

    // Initial title setup
    updateTitleElement();
});
