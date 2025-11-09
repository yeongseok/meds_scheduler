# Profile Authentication Dialog - Testing Guide

## How to Test

1. **Navigate to Profile Screen** (내 프로필)
   - From Settings screen, click on user profile section at top
   - OR access from Care Circle if implemented

2. **Enter Edit Mode**
   - Click "편집" (Edit) button in top-right
   - Form fields should become editable

3. **Make Changes**
   - Edit any of the following fields:
     - First Name (이름)
     - Last Name (성)
     - Phone Number (전화번호)
     - Date of Birth (생년월일)

4. **Save Changes**
   - Click "저장" (Save) button in top-right
   - **Authentication dialog should appear**

## Expected Authentication Dialog

### Dialog Appearance
- **Title**: "프로필 변경 인증" (Profile Change Authentication)
- **Description**: "프로필 정보를 변경하려면 비밀번호를 입력해주세요"
- **Email Field**: Read-only, shows current user email
- **Password Field**: 
  - Input with show/hide toggle (eye icon)
  - Focus automatically on open
  - Enter key submits
- **Security Notice**: Blue background box explaining why auth is needed
- **Buttons**:
  - "취소" (Cancel) - Closes dialog without saving
  - "인증" (Authenticate) - Verifies password and saves

### Success Flow
1. Enter correct password
2. Click "인증" or press Enter
3. Toast: "인증되었습니다" (Authenticated successfully)
4. Dialog closes
5. Profile saves to Firebase
6. Toast: "프로필이 성공적으로 업데이트되었습니다"
7. Edit mode exits automatically

### Error Flows

**Wrong Password**:
- Toast: "비밀번호가 올바르지 않습니다"
- Password field clears
- Dialog stays open for retry

**Too Many Attempts**:
- Toast: "너무 많은 시도가 있었습니다. 나중에 다시 시도해주세요"
- Password field clears

**Network Error**:
- Toast: "네트워크 오류가 발생했습니다"

## Debug Information

If the dialog doesn't appear:

1. **Check Browser Console** for:
   - "Save button clicked" - Confirms button handler runs
   - "Opening auth dialog" - Confirms state change triggered
   - "Auth dialog state set to true" - Confirms setState called
   - "Auth dialog should now be visible" - Confirms useEffect triggered

2. **Check for JavaScript Errors**:
   - Missing imports
   - Component render errors
   - Firebase auth errors

3. **Check DOM**:
   - Look for element with `data-slot="dialog-portal"`
   - Check if overlay is visible (should be semi-transparent black)
   - Check z-index values

## Implementation Details

### Components
- **/components/UserAuthDialog.tsx** - Auth modal component
- **/components/ProfilePage.tsx** - Uses the dialog

### Firebase Function
- **/lib/firebase/auth.ts** - `reauthenticateUser(email, password)`

### State Management
- `showAuthDialog` - Boolean state controlling dialog visibility
- Opens on "저장" click
- Closes on successful auth or cancel

### Security
- Firebase reauthentication required before profile updates
- Protects against unauthorized profile changes
- Password never stored, only used for verification
