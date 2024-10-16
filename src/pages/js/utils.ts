export function isAdminLoggedIn(param_cookie: any) {
    if (param_cookie == undefined || param_cookie == "")
        return false
    else
        return true;
}

export function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
}

export function removeHTMLTags(str: string) {
    // Regular expression to match HTML tags
    const regex = /<\/?[^>]+(>|$)/g;
    // Replace matched HTML tags with an empty string
    return str.replace(regex, "");
}

export function timeDifference(dateTime: string | Date): string {
    const inputTime = new Date(dateTime);
    const currentTime = new Date();

    const diffInMs = currentTime.getTime() - inputTime.getTime();
    const diffInMin = Math.floor(diffInMs / 1000 / 60);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 6) {
        return "NA";
    }

    if (diffInDays > 0) {
        return diffInDays === 1 ? "1 Day" : `${diffInDays} Days`;
    }

    if (diffInHours > 0) {
        const remainingMinutes = diffInMin % 60;
        return remainingMinutes > 0
            ? `${diffInHours} Hr${diffInHours > 1 ? 's' : ''}, ${remainingMinutes} Min`
            : `${diffInHours} Hr${diffInHours > 1 ? 's' : ''}`;
    }

    return `${diffInMin} Min`;
}


// Example usage:
//   console.log(timeDifference('2024-07-01T10:00:00')); // Adjust the date and time as needed
