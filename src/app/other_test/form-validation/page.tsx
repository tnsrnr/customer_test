'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  plan: string;
  acceptTerms: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  plan?: string;
  acceptTerms?: string;
}

export default function FormValidationPage() {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: "",
    acceptTerms: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // 입력 필드에 값이 입력되면 해당 필드의 오류 메시지 제거
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData({
      ...formData,
      plan: value,
    });
    
    if (errors.plan) {
      setErrors({
        ...errors,
        plan: undefined,
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      acceptTerms: checked,
    });
    
    if (errors.acceptTerms) {
      setErrors({
        ...errors,
        acceptTerms: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // 사용자 이름 검증
    if (!formData.username.trim()) {
      newErrors.username = "사용자 이름을 입력하세요";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "사용자 이름은 3자 이상이어야 합니다";
      isValid = false;
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력하세요";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력하세요";
      isValid = false;
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력하세요";
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
      isValid = false;
    }

    // 비밀번호 확인
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력하세요";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
      isValid = false;
    }

    // 요금제 선택 검증
    if (!formData.plan) {
      newErrors.plan = "요금제를 선택하세요";
      isValid = false;
    }

    // 약관 동의 검증
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "약관에 동의해야 합니다";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // 실제로는 API 호출 등을 수행
      setTimeout(() => {
        toast({
          title: "회원 가입 완료",
          description: "회원 가입이 성공적으로 완료되었습니다. 이메일을 확인해 주세요.",
        });
        
        // 폼 초기화
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          plan: "",
          acceptTerms: false,
        });
        
        setIsSubmitting(false);
      }, 1500);
    } else {
      toast({
        title: "양식 오류",
        description: "입력 양식을 확인하세요.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      plan: "",
      acceptTerms: false,
    });
    setErrors({});
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">폼 밸리데이션 데모</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>회원 가입</CardTitle>
          <CardDescription>아래 양식을 작성하여 새 계정을 만드세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 사용자 이름 필드 */}
            <div className="space-y-2">
              <Label htmlFor="username">사용자 이름</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            {/* 이메일 필드 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* 비밀번호 필드 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            {/* 비밀번호 확인 필드 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* 요금제 선택 */}
            <div className="space-y-3">
              <Label>요금제 선택</Label>
              <RadioGroup 
                value={formData.plan} 
                onValueChange={handleRadioChange}
                className={errors.plan ? "text-red-500" : ""}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free">무료</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pro" id="pro" />
                  <Label htmlFor="pro">프로</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enterprise" id="enterprise" />
                  <Label htmlFor="enterprise">엔터프라이즈</Label>
                </div>
              </RadioGroup>
              {errors.plan && (
                <p className="text-sm text-red-500">{errors.plan}</p>
              )}
            </div>
            
            {/* 약관 동의 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="acceptTerms" 
                  checked={formData.acceptTerms}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label 
                  htmlFor="acceptTerms" 
                  className={errors.acceptTerms ? "text-red-500" : ""}
                >
                  이용약관 및 개인정보 처리방침에 동의합니다
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                disabled={isSubmitting}
              >
                초기화
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : "가입하기"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 border-t pt-4">
          이 데모는 실제로 회원 가입을 처리하지 않습니다. 클라이언트 측 폼 밸리데이션만 보여주는 예제입니다.
        </CardFooter>
      </Card>
    </div>
  );
} 