<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DevRadar Content Status</title>
</head>
<body style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
    <h2 style="margin: 0 0 12px;">Update on your {{ ucfirst($contentType) }}</h2>

    <p style="margin: 0 0 8px;"><strong>Title:</strong> {{ $title }}</p>
    <p style="margin: 0 0 16px;"><strong>Status:</strong> {{ strtoupper($status) }}</p>

    @if($status === 'pending')
        <p style="margin: 0 0 16px;">
            Your submission has been received and is waiting for admin approval.
            We will notify you as soon as it is reviewed.
        </p>
    @elseif($status === 'approved')
        <p style="margin: 0 0 16px;">
            Great news - your {{ $contentType }} has been approved and is now visible on DevRadar.
        </p>
    @else
        <p style="margin: 0 0 8px;">
            Your {{ $contentType }} was reviewed and rejected.
        </p>
        @if(!empty($reason))
            <p style="margin: 0 0 16px;"><strong>Reason:</strong> {{ $reason }}</p>
        @endif
    @endif

    <p style="margin: 0;">Thanks,<br>DevRadar Team</p>
</body>
</html>

