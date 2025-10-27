# 📧 EmailJS Setup Guide - TechMorpho (5 Minutes)

## ✅ What You Get:
- ✅ **Pure JavaScript** - No PHP needed
- ✅ **Works Anywhere** - GitHub Pages, Netlify, any hosting
- ✅ **Free** - 200 emails/month
- ✅ **Easy Setup** - 5 simple steps

---

## 🚀 Setup Steps (5 Minutes):

### **Step 1: Sign Up for EmailJS** (1 min)

1. Go to: **https://www.emailjs.com**
2. Click **"Sign Up Free"**
3. Create account with your email
4. Verify your email

---

### **Step 2: Connect Your Email** (2 min)

1. **After login**, click **"Add New Service"**
2. **Choose your email provider:**
   - Gmail (recommended)
   - Outlook
   - Yahoo
   - Or any other

3. **For Gmail:**
   - Click **"Connect Account"**
   - Log in with your Gmail
   - Allow EmailJS access
   
4. **Copy your Service ID** (looks like: `service_abc123`)
   - Write it down!

---

### **Step 3: Create Email Template** (1 min)

1. Go to **"Email Templates"** tab
2. Click **"Create New Template"**
3. **Use this template:**

```
Subject: 
New Contact from {{from_name}} - TechMorpho Website

Content:
You have a new contact form submission!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: {{from_name}}
Email: {{email}}
Phone: {{phone}}
Service: {{service}}

Message:
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply directly to: {{email}}
Submitted: {{submit_date}}
```

4. **Set:**
   - **To Email:** info@techmorpho.in (your email address where you want to receive messages)
   - **From Name:** `{{from_name}}`
   - **Reply To:** `{{email}}`

5. **Save** and **Copy the Template ID** (looks like: `template_xyz789`)
   - Write it down!

---

### **Step 4: Get Your Public Key** (30 sec)

1. Go to **"Account"** tab
2. Find **"Public Key"** (looks like: `a1b2c3d4e5f6g7h8`)
3. **Copy it** - Write it down!

---

### **Step 5: Update Your Website** (1 min)

Open **`assets/js/contact-form.js`** and update lines 9-11:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'a1b2c3d4e5f6g7h8',      // ⬅️ Paste your Public Key
    serviceID: 'service_abc123',         // ⬅️ Paste your Service ID
    templateID: 'template_xyz789'        // ⬅️ Paste your Template ID
};
```

**Replace with YOUR keys!**

---

## ✅ That's It! Test Your Form:

1. Open **`contact.html`** in browser
2. Fill out the form
3. Click **"Send Message"**
4. You should see: **"✅ Thank you! Your message has been sent"**
5. Check your email inbox! 📧

---

## 📧 What You'll Receive:

When someone submits the form, you'll get an email like:

```
From: John Doe via EmailJS
Subject: New Contact from John Doe - TechMorpho Website

You have a new contact form submission!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: John Doe
Email: john@example.com
Phone: +1 (555) 123-4567
Service: Website Development

Message:
I'm interested in getting a new website for my business. 
Please contact me to discuss the details.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply directly to: john@example.com
```

You can **reply directly** to the customer! ✅

---

## 🎯 EmailJS Dashboard Features:

### **View Submissions:**
- Go to **"History"** tab
- See all form submissions
- Track delivery status

### **Free Plan Includes:**
- ✅ 200 emails/month
- ✅ 2 email templates
- ✅ Spam protection
- ✅ Email history

### **Need More?**
- **Personal Plan:** $7/month - 1,000 emails
- **Professional Plan:** $23/month - 10,000 emails

---

## 🔧 Troubleshooting:

### ❌ "Email service not loaded"
**Fix:** Hard refresh your browser
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### ❌ "Failed to send"
**Fixes:**
1. Check your **Public Key** in `contact-form.js`
2. Check your **Service ID** is correct
3. Check your **Template ID** is correct
4. Make sure template is **active** (not in draft)
5. Check EmailJS dashboard for errors

### ❌ "Not receiving emails"
**Fixes:**
1. Check **spam/junk folder**
2. Verify **"To Email"** in template settings
3. Check **email service connection** in EmailJS dashboard
4. Reconnect your Gmail/email account

### ❌ "Invalid template variables"
**Fix:** Make sure your template uses these variable names:
- `{{from_name}}`
- `{{email}}`
- `{{phone}}`
- `{{service}}`
- `{{message}}`

These match your form field names!

---

## 🎨 Customization:

### Change Success Message:
Edit `contact-form.js` line 50:
```javascript
showMessage('success', '✅ Your custom message here!');
```

### Change Error Message:
Edit `contact-form.js` line 55:
```javascript
showMessage('error', '❌ Your custom error message!');
```

### Add Auto-Reply to Customer:
In EmailJS dashboard:
1. Create **another template** for auto-reply
2. In `contact-form.js`, add after line 47:
```javascript
// Send auto-reply to customer
emailjs.send(
    EMAILJS_CONFIG.serviceID,
    'template_autoreply', // Your auto-reply template ID
    {
        to_email: contactForm.email.value,
        to_name: contactForm.name.value
    }
);
```

---

## 📊 Form Field Mapping:

Your form sends these fields automatically:

| HTML Field | EmailJS Variable | What It Contains |
|------------|------------------|------------------|
| `name` | `{{from_name}}` | Customer's name |
| `email` | `{{email}}` | Customer's email |
| `phone` | `{{phone}}` | Phone number |
| `service` | `{{service}}` | Selected service |
| `message` | `{{message}}` | Their message |

---

## 💡 Pro Tips:

### ✅ **Test Before Going Live:**
1. Use your own email in the form
2. Submit a test message
3. Make sure you receive it
4. Check if reply works

### ✅ **Set Up Email Filters:**
1. In Gmail, create a label "TechMorpho Leads"
2. Filter all EmailJS messages to this label
3. Enable notifications for this label
4. Never miss a lead!

### ✅ **Monitor Your Quota:**
- Check EmailJS dashboard regularly
- You get 200 emails/month free
- Upgrade if you get more inquiries

### ✅ **Backup Plan:**
- Keep your WhatsApp button on the contact page
- Customers can always reach you via WhatsApp
- You have `https://wa.me/15551234567` set up

---

## 🎯 Quick Reference:

### Your Config (Update in `contact-form.js`):
```javascript
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',    // From Account tab
    serviceID: 'service_XXXXXX',     // From Email Services
    templateID: 'template_XXXXXX'    // From Email Templates
};
```

### Important Links:
- **Dashboard:** https://dashboard.emailjs.com
- **Documentation:** https://www.emailjs.com/docs
- **Support:** https://www.emailjs.com/support

---

## ✨ Advantages Over PHP:

✅ **Works Everywhere** - Even on static hosting  
✅ **No Server Setup** - Just JavaScript  
✅ **Better Spam Protection** - Built-in filters  
✅ **Email History** - See all submissions in dashboard  
✅ **Easy Testing** - Works locally without a server  
✅ **Auto-Replies** - Can send confirmation to customers  
✅ **Multiple Recipients** - Send to multiple emails  

---

## 🎉 You're All Set!

Your contact form is now powered by EmailJS!

**Next Steps:**
1. ✅ Sign up for EmailJS
2. ✅ Get your 3 keys (Public, Service, Template)
3. ✅ Update `contact-form.js` with your keys
4. ✅ Test the form
5. ✅ Start receiving inquiries! 🚀

---

**Need help? Check the troubleshooting section or visit EmailJS documentation!** 📚

