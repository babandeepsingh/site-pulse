"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LandingPage from "@/components/LandingPage/LandingPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDashboard } from "./useDashboard";
import { UserButton } from "@clerk/nextjs";

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
  } = useDashboard();

  return (
    <div className="font-sans px-4 sm:px-8 lg:px-32 py-4 h-screen">
      {isSignedIn ? (
        <>
          <div className="flex justify-end">
             <UserButton />
          </div>

          <div className="grid">
            {showError && (
              <Alert variant="destructive">
                <AlertTitle>Sorry</AlertTitle>
                <AlertDescription>We are not able to process the request currently</AlertDescription>
              </Alert>
            )}

            <h6>
              Welcome,{" "}
              <span className="bg-gradient-to-r text-xl from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                {userData?.fullname}
              </span>
            </h6>
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
                  onClick={() => handleSiteClick(site?.checks, siteKey)}
                  className={`bg-gradient-to-r from-violet-500 to-indigo-500 text-white`}
                >
                  <CardHeader>
                    <CardTitle>URL : {siteKey}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Name : {site.metadata.name || "------"}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
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

          {isSignedIn && !loading && Object.keys(sites).length < 5 && <form style={{ width: '100%', maxWidth: '600px' }} onSubmit={handleNewUrl}>
            <Label htmlFor="url" className="py-4">URL</Label>
            <Input
              className="focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 w-full"
              type="text"
              name="url"
              onChange={handleFormValues}
            />
            {urlError && <div className="text-red-400 text-sm py-1">{urlError}</div>}

            <Label htmlFor="name" className="py-4">Name</Label>
            <Input
              type="text"
              className="focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 w-full"
              name="name"
              onChange={handleFormValues}
            />

            <Button className="py-4 my-4 bg-violet-700 hover:bg-violet-800 text-white text-lg px-6 rounded-md w-full" type="submit">
              Submit
            </Button>
          </form>}
        </>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
