"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LandingPage from "@/components/LandingPage/LandingPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDashboard } from "./useDashboard";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import logo from './assets/logo.png'
import { metadata } from "./layout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default function Home() {
  const {
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
  } = useDashboard();

  return (
    <div className="font-sans px-4 sm:px-8 lg:px-32 py-4 h-screen">
      {isSignedIn ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <Image
                src={logo}
                alt="SitesPulse"
                className="rounded-full m-1"
                width={50}
                height={25}
              />
            </div>
            <div>
              <UserButton />
            </div>
          </div>

          <div className="grid">
            {showError && (
              <Alert variant="destructive">
                <AlertTitle>Sorry</AlertTitle>
                <AlertDescription>We are not able to process the request currently</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-between py-3">
              <h6>
                Welcome,{" "}
                <span className="bg-gradient-to-r text-xl from-cyan-600 to-sky-800 bg-clip-text text-transparent">
                  {userData?.fullname}
                </span>
              </h6>
              {isSignedIn && userData && !loading && Object.values(sites).filter(site => site?.metadata?.isActive).length < 5 && <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-0">Add new site</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add a new site</DialogTitle>
                    <DialogDescription>
                      We will try to reach website if site is reachable we will add to the dasboard
                    </DialogDescription>
                  </DialogHeader>
                  <form style={{ width: '100%', maxWidth: '600px' }} onSubmit={handleNewUrl}>
                    <div className="py-4 flex gap-1 items-center">

                      <Label htmlFor="url" >URL</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={'12px'} />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Please add the URL you want to monitor.</p>
                          <p>eg: https://sitespulse.babandeep.in</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      className="focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2 w-full"
                      type="text"
                      name="url"
                      onChange={handleFormValues}
                    />
                    {urlError && <div className="text-red-800 text-xs py-1">{urlError}</div>}

                    <Label htmlFor="name" className="py-4">Name</Label>

                    <Input
                      type="text"
                      className="focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 w-full"
                      name="name"
                      onChange={handleFormValues}
                    />

                    <Button className="py-4 my-4 bg-cyan-600 hover:bg-sky-800 text-white text-lg px-6 rounded-md w-full" type="submit">
                      Submit
                    </Button>
                    <DialogClose asChild>
                      <Button className="w-full border-0" onClick={e=>setUrlError('')} ref={closeRef} type="button" variant="outline">
                        Close
                      </Button>
                    </DialogClose>
                  </form>
                  <DialogFooter className="sm:justify-start">


                  </DialogFooter>
                </DialogContent>
              </Dialog>}
            </div>

          </div>

          {loading && (
            <div className="flex flex-col space-y-3 py-4">
              <div className="space-y-2 flex flex-wrap gap-3">
                <Skeleton className="h-[50px] w-full sm:w-[250px]" />
                <Skeleton className="h-[50px] w-full sm:w-[250px]" />
                <Skeleton className="h-[50px] w-full sm:w-[250px]" />
                <Skeleton className="h-[50px] w-full sm:w-[250px]" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {Object.keys(sites).map((siteKey) => {
              const site = sites[siteKey];
              return (
                <Card
                  key={siteKey}
                  onClick={() => site?.metadata?.isActive ? handleSiteClick(site?.checks, siteKey) : ''}
                  className={`transition-all duration-300 ease-in-out
                    ${site?.metadata?.isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-sky-800 text-white hover:from-sky-800 hover:to-cyan-600 hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                      : 'bg-secondary text-secondary-foreground shadow-xs border-0'
                    }`}
                // className={`bg-gradient-to-r from-teal-500 to-cyan-500 text-white ${site?.metadata?.isActive ? 'cursor-pointer' : 'bg-secondary text-secondary-foreground shadow-xs border-0'}`}
                >
                  <CardHeader>
                    <CardTitle className="text-base">URL : {siteKey}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Name : {site.metadata.name || "------"}</p>
                  </CardContent>
                  <CardFooter className="flex">
                    <p className="text-xs">
                      Created On: {new Date(site.metadata.createdAt).toLocaleString('en-GB')}
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {selectedChartOption && Object.keys(selectedChartOption).length > 0 && (
            <HighchartsReact highcharts={Highcharts} options={selectedChartOption} />
          )}

          {/* {isSignedIn && userData && !loading && Object.values(sites).filter(site => site?.metadata?.isActive).length < 5 && <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add new site</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add a new site</DialogTitle>
                <DialogDescription>
                  We will try to reach website if site is reachable we will add in dasboard
                </DialogDescription>
              </DialogHeader>
              <form style={{ width: '100%', maxWidth: '600px' }} onSubmit={handleNewUrl}>
                <Label htmlFor="url" className="py-4">URL</Label>
                <Input
                  className="focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 w-full"
                  type="text"
                  name="url"
                  onChange={handleFormValues}
                />
                {urlError && <div className="text-red-400 text-sm py-1">{urlError}</div>}

                <Label htmlFor="name" className="py-4">Name</Label>
                <Input
                  type="text"
                  className="focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 w-full"
                  name="name"
                  onChange={handleFormValues}
                />

                <Button className="py-4 my-4 bg-teal-700 hover:bg-teal-800 text-white text-lg px-6 rounded-md w-full" type="submit">
                  Submit
                </Button>
                <DialogClose asChild>
                  <Button className="w-full" ref={closeRef} type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </form>
              <DialogFooter className="sm:justify-start">


              </DialogFooter>
            </DialogContent>
          </Dialog>}


          {isSignedIn && userData && !loading && Object.values(sites).filter(site => site?.metadata?.isActive).length < 5 && <form style={{ width: '100%', maxWidth: '600px' }} onSubmit={handleNewUrl}>
            <Label htmlFor="url" className="py-4">URL</Label>
            <Input
              className="focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 w-full"
              type="text"
              name="url"
              onChange={handleFormValues}
            />
            {urlError && <div className="text-red-400 text-sm py-1">{urlError}</div>}

            <Label htmlFor="name" className="py-4">Name</Label>
            <Input
              type="text"
              className="focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 w-full"
              name="name"
              onChange={handleFormValues}
            />

            <Button className="py-4 my-4 bg-teal-700 hover:bg-teal-800 text-white text-lg px-6 rounded-md w-full" type="submit">
              Submit
            </Button>
          </form>} */}
        </>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
