const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express'); // إضافة مكتبة express
const app = express();

const PORT = process.env.PORT || 3000; // استخدام المتغير البيئي PORT

app.get('/get-token', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://cromur.com/member-login/', { waitUntil: 'networkidle2' });
    await page.type('#iump_login_username', 'miannastephens13@gmail.com');
    await page.type('#iump_login_password', 'Rankerfox.com$cromur45');
    await page.click('input[name="Submit"]');
    await page.waitForNavigation();
    const cookies = await page.cookies();
    const sessionToken = cookies.find(cookie => cookie.name === 'wordpress_logged_in_ff2021aca1979e72ef427c8eb0b0cc4d');

    if (sessionToken) {
      const tokenData = {
        name: sessionToken.name,
        value: sessionToken.value,
        domain: sessionToken.domain,
        path: sessionToken.path,
        expires: sessionToken.expires,
        httpOnly: sessionToken.httpOnly,
        secure: sessionToken.secure
      };

      fs.writeFileSync('sessionToken.json', JSON.stringify(tokenData, null, 2));
      console.log('تم استخراج توكين الجلسة وحفظه بنجاح في ملف sessionToken.json');
      res.json({ success: true, token: tokenData });
    } else {
      console.log('لم يتم العثور على توكين الجلسة.');
      res.json({ success: false, message: 'لم يتم العثور على توكين الجلسة.' });
    }

    await browser.close();
  } catch (error) {
    console.error('حدث خطأ:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء استخراج التوكين.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
