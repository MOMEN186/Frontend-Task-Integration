"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";

export type TestCallPayload = {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
};

type Props = {
  onStartCall: (payload: TestCallPayload) => Promise<void>;
  disabled?: boolean;
};

export default function TestCallCard({ onStartCall, disabled }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleStart = async () => {
    await onStartCall({ firstName, lastName, gender, phoneNumber });
  };

  return (
    <div className="lg:sticky lg:top-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Test Call
          </CardTitle>
          <CardDescription>
            Make a test call to preview your agent. Each test call will deduct
            credits from your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="test-first-name">First Name</Label>
                <Input
                  id="test-first-name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-last-name">Last Name</Label>
                <Input
                  id="test-last-name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <PhoneInput
                defaultCountry="EG"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value)}
                placeholder="Enter phone number"
              />
            </div>

            <Button
              type="button"
              onClick={handleStart}
              className="w-full"
              disabled={disabled}
            >
              <Phone className="mr-2 h-4 w-4" />
              Start Test Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
