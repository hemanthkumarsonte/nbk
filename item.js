// Sales data structure
let salesData = {
    date: new Date().toDateString(),
    drinks: {
        1: { name: 'badam milk', price: 40, sold: 0, earned: 0, upiEarned: 0 },
        2: { name: 'Pepsi', price: 25, sold: 0, earned: 0, upiEarned: 0 },
        3: { name: 'lassi', price: 30, sold: 0, earned: 0, upiEarned: 0 },
        4: { name: 'samosa', price: 30, sold: 0, earned: 0, upiEarned: 0 },
        5: { name: 'Water Bottle', price: 20, sold: 0, earned: 0, upiEarned: 0 }
    },
    totalEarnings: 0,
    totalDrinks: 0,
    totalUpi: 0 // NEW: total UPI earnings
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadSalesData();
    updateCurrentDate();
    updateDisplay();
});

// Update current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-IN', options);
}

// Load sales data from localStorage
function loadSalesData() {
    const saved = localStorage.getItem('drinkSalesData');
    const today = new Date().toDateString();
    
    if (saved) {
        const savedData = JSON.parse(saved);
        
        // If it's a new day, reset the data
        if (savedData.date !== today) {
            resetSalesData();
        } else {
            salesData = savedData;
        }
    }
}

// Save sales data to localStorage
function saveSalesData() {
    localStorage.setItem('drinkSalesData', JSON.stringify(salesData));
}

// Reset sales data for new day
function resetSalesData() {
    salesData = {
        date: new Date().toDateString(),
        drinks: {
            1: { name: 'Coca Cola', price: 25, sold: 0, earned: 0, upiEarned: 0 },
            2: { name: 'Pepsi', price: 25, sold: 0, earned: 0, upiEarned: 0 },
            3: { name: 'Sprite', price: 20, sold: 0, earned: 0, upiEarned: 0 },
            4: { name: 'Orange Juice', price: 30, sold: 0, earned: 0, upiEarned: 0 },
            5: { name: 'Water Bottle', price: 15, sold: 0, earned: 0, upiEarned: 0 }
        },
        totalEarnings: 0,
        totalDrinks: 0,
        totalUpi: 0
    };
    saveSalesData();
}

// Sell a drink (Cash/Normal)
function sellDrink(id, name, price) {
    salesData.drinks[id].sold += 1;
    salesData.drinks[id].earned += price;
    salesData.totalDrinks += 1;
    salesData.totalEarnings += price;
    
    saveSalesData();
    updateDisplay();
    showSaleFeedback(name, price);
}

// Sell a drink via UPI
function sellDrinkUPI(id, name, price) {
    salesData.drinks[id].sold += 1;
    salesData.drinks[id].earned += price;
    salesData.drinks[id].upiEarned += price; // NEW: add to UPI
    salesData.totalDrinks += 1;
    salesData.totalEarnings += price;
    salesData.totalUpi += price; // NEW: add to total UPI
    
    saveSalesData();
    updateDisplay();
    showSaleFeedback(`${name} (UPI)`, price);
}

// Update all display elements
function updateDisplay() {
    document.getElementById('total-earnings').textContent = `₹${salesData.totalEarnings}`;
    document.getElementById('total-drinks').textContent = salesData.totalDrinks;
    document.getElementById('total-upi').textContent = `₹${salesData.totalUpi}`; // NEW
    
    const averagePrice = salesData.totalDrinks > 0 ? 
        Math.round(salesData.totalEarnings / salesData.totalDrinks) : 0;
    document.getElementById('average-price').textContent = `₹${averagePrice}`;
    
    // Update drink cards
    Object.keys(salesData.drinks).forEach(id => {
        const drink = salesData.drinks[id];
        const card = document.querySelector(`[data-id="${id}"]`);
        
        if (card) {
            card.querySelector('.sold-count').textContent = drink.sold;
            card.querySelector('.earned-amount').textContent = `₹${drink.earned}`;
            
            // NEW: update UPI earnings display
            const upiBox = card.querySelector('.upi-amount');
            if (upiBox) {
                upiBox.textContent = `UPI: ₹${drink.upiEarned}`;
            }
        }
    });
}

// Show sale feedback
function showSaleFeedback(name, price) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #4CAF50;
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: fadeInOut 2s ease-in-out;
    `;
    feedback.textContent = `✅ Sold ${name} for ₹${price}`;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        document.body.removeChild(feedback);
        document.head.removeChild(style);
    }, 2000);
}

// Reset sales (manual reset)
function resetSales() {
    if (confirm('Are you sure you want to reset today\'s sales? This cannot be undone.')) {
        resetSalesData();
        updateDisplay();
        
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4757;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        feedback.textContent = '🔄 Sales data has been reset!';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 2000);
    }
}
