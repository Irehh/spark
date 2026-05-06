export const ResetPasswordTemplate = (name: string, token: string, appUrl: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .btn { display: inline-block; padding: 12px 24px; background-color: #4A90E2; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your Spark password. Click the button below to choose a new password:</p>
        <a href="${appUrl}/reset-password?token=${token}" class="btn">Reset Password</a>
        <p style="margin-top:20px; font-size: 12px; color: #777;">If you didn't request this, you can safely ignore this email.</p>
    </div>
</body>
</html>
`;
