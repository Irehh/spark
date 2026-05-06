export const VerifyEmailTemplate = (name: string, token: string, appUrl: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .btn { display: inline-block; padding: 12px 24px; background-color: #E35D5D; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to Spark, ${name}!</h2>
        <p>Please verify your email address to unlock all features.</p>
        <a href="${appUrl}/verify-email?token=${token}" class="btn">Verify Email</a>
        <p style="margin-top:20px; font-size: 12px; color: #777;">If you didn't create this account, you can ignore this email.</p>
    </div>
</body>
</html>
`;
