import { useState, useEffect, useRef } from "react";
import { useUserLogin } from "@/app/hooks/useUserLogin";
import { toast } from "sonner"
interface SiteCheck {
    checkcreatedat: string;
    status: number;
    color: string;
}

interface Site {
    metadata: {
        name: string;
        createdAt: string;
        isActive: Boolean
    };
    checks: SiteCheck[];
}

export function useDashboard() {
    const { isSignedIn, userData } = useUserLogin();
    const closeRef = useRef<HTMLButtonElement>(null);
    console.log(isSignedIn, userData, "Woho:::")
    const [sites, setSites] = useState<{ [key: string]: Site }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedChartOption, setSelectedChartOption] = useState<any>({});
    const [selectedLink, setSelectedLink] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const [formData, setFormData] = useState<{ userId: number; name: string; url: string }>({
        userId: 0,
        name: "",
        url: ""
    });
    const [urlError, setUrlError] = useState<string>("");

    const getCheckStatus = async (id: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/check/${id}`);
            // const responses = await fetch(`/api/cron`);

            const data = await response.json();
            setSites(data.sites);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData?.id) {
            getCheckStatus(userData.id);
        }
    }, [userData?.id]);

    const handleSiteClick = (vals: SiteCheck[], name: string) => {
        if (name === selectedLink) {
            setSelectedLink("");
            setSelectedChartOption({});
            return;
        }

        const betterInfo = vals.map((val) => {
            const status = val.status ?? 400;
            const formattedCheckCreatedAt = new Date(val.checkcreatedat).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            return {
                checkcreatedat: formattedCheckCreatedAt,
                status,
                // color: status < 400 ? '#14532d' : '#b91c1c'
                color: status < 400 ? {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#0891b2'],
                        [1, '#075985'],
                    ],
                } : {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#991b1b'],
                        [1, '#450a0a'],
                    ],
                }

            };
        });

        const categories = betterInfo.map(item => item.checkcreatedat);
        const dataChart = betterInfo.map(item => ({
            y: item.status,
            color: item.color
        }));

        setSelectedLink(name);

        setSelectedChartOption({
            chart: {
                type: 'column',
                animation: {
                    duration: 1000
                }
            },
            title: {
                text: `Chart | Web monitoring | ${name}`,
                style: {
                    color: '#042f2e',
                    fontWeight: 'normal'
                }
            },
            // subtitle: {
            //     text: "Blue indicates a healthy site, Red indicates an error",
            //     style: {
            //         fontSize: '14px',
            //         color: '#1e1b4b',
            //         fontWeight: 'normal',
            //         marginTop: '10px',
            //     }
            // },
            subtitle: {
                useHTML: true,
                text: `<span class="gradient-text">Blue indicates a healthy site, Red indicates an error</span>`,
            },
            xAxis: {
                categories,
                crosshair: true,
                title: { text: 'Timestamp' }
            },
            yAxis: {
                title: { text: 'Status Code' }
            },
            legend: { enabled: false },
            series: [{ data: dataChart }]
        });
    };

    const handleNewUrl = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userData?.id) {
            const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\.[a-z]{2})?([\/\w .-]*)*\/?$/i;
            if (!formData.url) {
                setUrlError("URL is required");
                return;
            }
            if (!urlPattern.test(formData.url)) {
                setUrlError("Looks like URL is not valid");
                return;
            }

            const formDataClone = { ...formData, userId: userData.id };
            try {
                const result = await fetch('/api/sites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formDataClone),
                });
                if (!result.ok) {
                    // setShowError(true);
                    // setTimeout(() => setShowError(false), 2000);
                    toast.warning(`${formData.url} is not reachable. Please try again`)
                    // closeRef.current?.click();

                    return;
                }
                toast.success(`${formData.url} is added. Loading dashboard....`)

                closeRef.current?.click();
                getCheckStatus(userData.id);

            } catch (error) {
                console.error(error);
                closeRef.current?.click();

            }
        }
    };

    const handleFormValues = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUrlError('');
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return {
        isSignedIn,
        userData,
        sites,
        loading,
        selectedChartOption,
        selectedLink,
        showError,
        formData,
        urlError,
        handleSiteClick,
        handleNewUrl,
        handleFormValues,
        closeRef,
        setUrlError
    };
}
