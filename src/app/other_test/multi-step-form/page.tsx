'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react';

export default function MultiStepFormDemo() {
  // 현재 폼 단계
  const [currentStep, setCurrentStep] = useState(1);
  // 총 단계 수
  const totalSteps = 4;
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    // 1단계: 개인정보
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // 2단계: 주소정보
    address: '',
    city: '',
    postalCode: '',
    country: 'KR',
    // 3단계: 선호 사항
    preferredContact: 'email',
    interests: [],
    // 4단계: 추가 정보
    additionalInfo: '',
    termsAccepted: false
  });
  // 완료 상태
  const [isComplete, setIsComplete] = useState(false);

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // 관심사 체크박스 변경 핸들러
  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter(item => item !== interest)
      });
    }
  };

  // 셀렉트 변경 핸들러
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 라디오 변경 핸들러
  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 다음 단계로 이동
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 단계에서는 완료 처리
      setIsComplete(true);
    }
  };

  // 이전 단계로 이동
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 애플리케이션에서는 여기서 API 호출 등을 통해 데이터를 서버로 전송
    console.log('제출된 데이터:', formData);
    setIsComplete(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'KR',
      preferredContact: 'email',
      interests: [],
      additionalInfo: '',
      termsAccepted: false
    });
    setCurrentStep(1);
    setIsComplete(false);
  };

  // 단계 표시 UI
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep || isComplete;
          
          return (
            <div key={stepNumber} className="flex items-center">
              {index > 0 && (
                <div className={`h-1 w-16 mx-2 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full 
                ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-500'}
                transition-colors duration-200
              `}>
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 1단계: 개인정보 폼
  const renderStep1 = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">이름</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">성</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="성을 입력하세요"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">전화번호</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="전화번호를 입력하세요"
          />
        </div>
      </div>
    );
  };

  // 2단계: 주소정보 폼
  const renderStep2 = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">주소</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="주소를 입력하세요"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">도시</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="도시를 입력하세요"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">우편번호</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="우편번호를 입력하세요"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">국가</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleSelectChange('country', value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="국가를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KR">대한민국</SelectItem>
              <SelectItem value="US">미국</SelectItem>
              <SelectItem value="JP">일본</SelectItem>
              <SelectItem value="CN">중국</SelectItem>
              <SelectItem value="GB">영국</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  // 3단계: 선호사항 폼
  const renderStep3 = () => {
    const interests = [
      { id: 'technology', label: '기술' },
      { id: 'design', label: '디자인' },
      { id: 'marketing', label: '마케팅' },
      { id: 'business', label: '비즈니스' },
      { id: 'science', label: '과학' }
    ];

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="preferredContact">선호하는 연락 방법</Label>
          <RadioGroup
            value={formData.preferredContact}
            onValueChange={(value) => handleRadioChange('preferredContact', value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email-contact" />
              <Label htmlFor="email-contact">이메일</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone-contact" />
              <Label htmlFor="phone-contact">전화</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both-contact" />
              <Label htmlFor="both-contact">모두</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>관심 분야 (복수 선택 가능)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {interests.map((interest) => (
              <div key={interest.id} className="flex items-center space-x-2">
                <Checkbox
                  id={interest.id}
                  checked={formData.interests.includes(interest.id)}
                  onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                />
                <Label htmlFor={interest.id}>{interest.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 4단계: 추가 정보 폼
  const renderStep4 = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="additionalInfo">추가 정보</Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="추가 정보를 입력하세요"
            rows={4}
          />
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <Checkbox
            id="termsAccepted"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked as boolean)}
            required
          />
          <Label htmlFor="termsAccepted" className="text-sm">
            개인정보 수집 및 이용에 동의합니다.
          </Label>
        </div>
      </div>
    );
  };

  // 완료 화면
  const renderComplete = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="p-4 bg-green-100 rounded-full">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-center">제출이 완료되었습니다!</h2>
        <p className="text-center text-muted-foreground max-w-md">
          입력하신 정보가 성공적으로 제출되었습니다. 감사합니다.
        </p>
        <Button onClick={resetForm}>새로운 폼 작성하기</Button>
      </div>
    );
  };

  // 현재 단계에 맞는 폼 렌더링
  const renderCurrentStep = () => {
    if (isComplete) return renderComplete();

    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  // 단계별 제목 및 설명
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return { title: '개인 정보', description: '기본적인 개인 정보를 입력해주세요' };
      case 2:
        return { title: '주소 정보', description: '주소 정보를 입력해주세요' };
      case 3:
        return { title: '선호 사항', description: '선호하는 연락 방법 및 관심 분야를 선택해주세요' };
      case 4:
        return { title: '추가 정보', description: '추가 정보를 입력하고 동의 사항을 확인해주세요' };
      default:
        return { title: '', description: '' };
    }
  };

  const { title, description } = getStepTitle();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/other_test">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">멀티스텝 폼 데모</h1>
          <p className="text-muted-foreground mt-1">여러 단계로 나누어진 폼 입력 예시</p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        {!isComplete && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          {!isComplete && renderStepIndicator()}
          <form onSubmit={handleSubmit}>
            {renderCurrentStep()}
          </form>
        </CardContent>
        {!isComplete && (
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
            >
              이전 단계
            </Button>
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>다음 단계</Button>
            ) : (
              <Button type="submit" onClick={handleSubmit}>제출하기</Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
} 