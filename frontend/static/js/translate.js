async function loadTranslations(lang) {
    try {
        const response = await fetch(`../static/json/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load ${lang} translations`);
        return response.json();
    } catch (error) {
        console.error(error);
        return {}; // Fallback to an empty object if there's an error
    }
}

// Translate the page based on the selected language
async function translatePage(lang) {
    const labels = await loadTranslations(lang);

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (labels[key]) {
            element.textContent = labels[key];
        }
    });

    document.title = labels.pageTitle || document.title;
}

// Load the saved language and translate the page
document.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('language') || 'en'; // Default to English if no saved language
    document.getElementById('langSelector').value = savedLang;
    await translatePage(savedLang);
});

// Change language when the user selects a new option
document.getElementById('langSelector').addEventListener('change', async (event) => {
    const lang = event.target.value;
    localStorage.setItem('language', lang);
    await translatePage(lang);
});