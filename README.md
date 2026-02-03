# HealthMind: A Digital Home for Healing 🌿🩹

This website is more than just code—it’s the digital home of our **Health Psychology** clinic. We built this space to make sure that anyone struggling with their mental or physical health can find the support they need, whenever and wherever they are. 

We believe that your mental well-being is the foundation of your physical health, and we wanted our website to reflect that same care, compassion, and professionalism.

---

## 💙 How This Site Serves You

When we designed this, we thought about the person on the other side of the screen. Here is what we’ve built for them:

*   **A Welcoming Start**: Our home page is designed to be calm and clear. It’s not just about services; it’s about letting you know that your health is our first priority.
*   **Support Without Borders**: We know that sometimes it’s hard to make it to the hospital. That’s why we’ve built a system that lets you book **Online Sessions** from anywhere in the world. Whether you’re in Nairobi or New York, you can find a safe space here.
*   **Learning & Growth**: We want to empower you. Our latest resources, like the article on the **Mind-Body Connection**, give you practical tips you can use right now to feel better, even before your first session.
*   **A Simple Path to Care**: Booking an appointment shouldn’t be stressful. We’ve made our booking form clean and simple, supporting international phone numbers so that help is just a few clicks away.
*   **Peace of Mind at Night**: Our specialized **Dark Mode** isn’t just a "feature"—it’s for those late nights when you need help but don’t want a bright screen. Everything is high-contrast and easy to read.

---

## 🌐 Making it Live (Deployment)

If you are setting this up for the first time or updating the clinic’s site, here is how you put it online using **GitHub Pages**.

### 1. Send the latest updates to GitHub:
Open your terminal and type these three simple commands:

```bash
git add .
git commit -m "Final version of our beautiful website"
git push origin main
```


## 🌍 **How to View Bookings on ALL Devices (Optional)**

By default, bookings are saved to the device (Phone/Laptop) where they were made. To see **Phone bookings on your Laptop**, you must enable **Cloud Sync**:

1.  **Create the Database**:
    *   Go to [Google Sheets](https://sheets.google.com) and create a cheat called "Hospital Bookings".
    *   Go to **Extensions > Apps Script**.
    *   Paste the code from `apps-script.gs` (included in your files).

2.  **Deploy**:
    *   Click **Deploy > New Deployment**.
    *   Select **Web App**.
    *   Who has access: **Anyone** (Important!).
    *   Click **Deploy** and copy the **Web App URL**.

3.  **Connect**:
    *   Paste the URL into `index.js` at line 138:
    *   `const GOOGLE_SCRIPT_URL = 'https://script.google.com/...';`

**Once connected, the Admin Dashboard will show bookings from every device!**

## 🩺 Our Philosophy

HealthMind is about bringing human connection back into medicine. We use technology like Google Sheets to keep our records organized safely, but at the end of the day, this site is about the person sitting behind the screen looking for a bit of hope.

*Thank you for being part of this journey toward a healthier, happier mindset.* 💙🧤
