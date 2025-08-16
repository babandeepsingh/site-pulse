"use client"

import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { SignIn } from "@clerk/clerk-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface userInterface {
  id: number,
  email: string,
  ispremium: boolean,
  accounttype: any,
  fullname: string,
  loginid: string
}
export default function Home() {
  const { isSignedIn, user } = useUser();
  const [userData, setUserData] = useState<userInterface | null>(null)
  const [loading, setLoading] = useState<boolean | null>(null)

  const [sites, setSites] = useState<{ [key: string]: any }>({});
  const [selectedChartOption, setSelectedChartOption] = useState({});
  const [selectLink, setSelectedLink] = useState("");
  const [formData, setFormData] = useState({
    userId: 0,
    name: '',
    url: ''
  });

  const [urlError, setUrlError] = useState('')


  const initiateSignIn = async (users: any) => {
    if (isSignedIn) {

      const result = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, email: user.emailAddresses[0]?.emailAddress, fullName: user.fullName, user: user }),
      });
      const data = await result.json(); // ✅ parse JSON response
      setUserData(data.user)
      console.log("POST:userMessage", data.user);
    }
  }

  useEffect(() => {
    if (userData?.id) {
      setLoading(true)
      fetch('/api/check/' + userData.id)
        .then((response) => response.json())
        .then((data) => {
          setSites(data.sites);
          console.log("Fetched sites:", data.sites);
          setLoading(false)

        })

      // const results = fetch('/api/check/' + userData.id + '/1'); // Example siteId, replace with actual siteId if needed

      // const data = await result.json(); // ✅ parse JSON response
    }
  }, [userData?.id])


  useEffect(() => {
    user && initiateSignIn(user)
  }, [isSignedIn, user]);


  const handleSiteClick = (vals: [], name: string) => {
    console.log(vals, name, selectLink, "yess:::")
    if (name == selectLink) {
      setSelectedLink("")
      setSelectedChartOption({})
      return
    }
    setSelectedChartOption({})
    setSelectedLink("")
    const betterInfo = vals.map((val: any) => {
      const status = val.status === null ? 400 : val.status;
      const formattedCheckCreatedAt = new Date(val.checkcreatedat).toLocaleString('en-GB', {
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit'
      });

      return {
        checkcreatedat: formattedCheckCreatedAt,
        status: status,
        color: (status < 400) ? 'green' : 'red'
      };
    });

    const categories = betterInfo.map(item => item.checkcreatedat);
    const dataChart = betterInfo.map(item => ({
      y: item.status,
      color: item.color
    }));

    console.log(vals, betterInfo, dataChart, "vals::::")
    setSelectedLink(name)

    setSelectedChartOption({
      chart: {
        type: 'column',
        animation: {
          duration: 1000
        }
      },
      title: {
        text: `${name} logs`
      },
      xAxis: {
        categories: categories,

        crosshair: true,
        accessibility: {
          description: 'Time stamps'
        },
        title: {
          text: 'Timestamp'
        }
      },
      yAxis: {
        title: {
          text: 'Status Code'
        }
      },
      legend: {
        enabled: false // 🔥 This removes the "Series 1" label
      },
      series: [
        {
          data: dataChart
        }
      ]
    })
  }

  const handleRefresh = () => {
    if (userData?.id) {
      fetch('/api/cron').then(resp => resp.json()).then(data => console.log(data))
    }
  }

  const handleNewUrl = async (e: any) => {
    e.preventDefault()
    console.log(formData, "yess")
    if (userData?.id) {
      const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\.[a-z]{2})?([\/\w .-]*)*\/?$/i;
      if (!formData.url) {
        setUrlError('URL is required')
        return
      }
      if (!urlPattern.test(formData.url)) {
        setUrlError('Looks like URL is not valid')
        return
      }
      // const result = await fetch(formData.url)
      // if (!result.ok) {
      //   // If the fetch fails, throw an error
      //   throw new Error("Failed to fetch the URL");
      // }
      // const data = await result.json()
      // console.log(data, "Data:::")
      const formDataClone = { ...formData }
      formDataClone.userId = userData.id

      const result = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataClone),
      });


      console.log(formData, "yess")

    }
  }

  const handleFormValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUrlError('')
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  return (
    <div className="font-sans px-32 py-4 h-screen">
      {isSignedIn ?
        <>
          <div className="flex justify-end">
            <UserButton />
          </div>
          <div className="grid">
            <h6>Welcome, {user?.fullName}</h6>
          </div>
          {loading && <div className="flex flex-col space-y-3  py-4">
            {/* <Skeleton className="h-[200px] w-[220px] rounded-xl" /> */}
            <div className="space-y-2 flex flex-wrap gap-3">
              <Skeleton className="h-[50px] w-[250px]" />
              <Skeleton className="h-[50px] w-[250px]" />
              <Skeleton className="h-[50px] w-[250px]" />
              <Skeleton className="h-[50px] w-[250px]" />

            </div>
          </div>}
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  py-4">
            {Object.keys(sites).length > 0 && Object.keys(sites).map(site => (
              <Card key={site} className={`${selectLink == site ? "shadow-lg ring-2 ring-zinc-800" : "shadow"}`} onClick={e => handleSiteClick(sites[site], site)}><CardHeader><CardTitle className="">{site}</CardTitle></CardHeader></Card>
            ))}
          </div>
          <div>
            {Object.keys(selectedChartOption).length > 0 && (

              <HighchartsReact highcharts={Highcharts} options={selectedChartOption} />

            )}
          </div>
          {/* <Button onClick={handleRefresh}>Refresh</Button> */}
          {/* <HighchartsReact highcharts={Highcharts} options={options} /> */}
          {isSignedIn && !loading && Object.keys(sites).length < 6 &&
            <form style={{ width: '50%' }} onSubmit={handleNewUrl}>
              <Label htmlFor="url" className="py-4">URL</Label>
              <Input className="foc" type="text" name="url" onChange={handleFormValues} />
              {urlError && <div className="text-red-400 text-sm py-1">{urlError}</div>}
              <Label htmlFor="url" className="py-4">Name</Label>
              <Input type="text" name="name" onChange={handleFormValues} />
              <Button className="py-4 my-4" type="submit">Submit</Button>
            </form>}
        </>
        :
        <div className="flex justify-center items-center h-full"><SignIn routing="hash" /></div>
      }

    </div>
  );
}
