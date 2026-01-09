# Multiple Image Upload Frontend Guide
## Using Formik + Yup + TanStack Query + FormData

This guide explains how to properly implement multiple image upload in React with complete validation and state management.

---

## Key Concepts

### 1. **Formik** - Form State Management
- Manages form values, validation, and submission
- Handles touched/error states automatically
- Provides `setFieldValue` for programmatic updates

### 2. **Yup** - Validation Schema
- Validates file count, size, and type
- Custom validation tests for files
- Provides user-friendly error messages

### 3. **TanStack Query (useMutation)** - API Calls
- Handles async mutations (create/update/delete)
- Automatic loading states
- Cache invalidation after success

### 4. **FormData** - File Upload
- Required for multipart/form-data
- Appends multiple files with same key
- Works with axios and fetch

---

## Complete Implementation Breakdown

### Step 1: Setup Validation Schema with Yup

```javascript
import * as Yup from "yup";

const productValidationSchema = Yup.object({
  pname: Yup.string()
    .required("Product name is required")
    .min(3, "Name must be at least 3 characters"),
  
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  
  category: Yup.string()
    .required("Category is required"),
  
  // File validation
  images: Yup.array()
    .max(5, "Maximum 5 images allowed")
    .test("fileSize", "Each file must be less than 5MB", (files) => {
      if (!files || files.length === 0) return true;
      return files.every(file => file.size <= 5 * 1024 * 1024);
    })
    .test("fileType", "Only JPEG, PNG, and WEBP images are allowed", (files) => {
      if (!files || files.length === 0) return true;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return files.every(file => allowedTypes.includes(file.type));
    })
});
```

**Key Points:**
- `Yup.array()` for multiple files
- `.max(5)` limits file count
- `.test()` for custom validation (size, type)
- Return `true` if validation passes

---

### Step 2: Setup State Management

```javascript
const [selectedFiles, setSelectedFiles] = useState([]);
const [previewUrls, setPreviewUrls] = useState([]);
const [editingId, setEditingId] = useState(null);
```

**Why separate states?**
- `selectedFiles` - Actual File objects for upload
- `previewUrls` - URLs for displaying previews
- `editingId` - Track edit mode

---

### Step 3: Initialize Formik

```javascript
import { useFormik } from "formik";

const formik = useFormik({
  initialValues: {
    pname: "",
    price: "",
    category: "",
    soldcount: 0,
    images: []  // Important: initialize as empty array
  },
  validationSchema: productValidationSchema,
  onSubmit: (values) => {
    const formData = new FormData();
    
    // Append text fields
    formData.append("pname", values.pname);
    formData.append("price", values.price);
    formData.append("category", values.category);
    formData.append("soldcount", values.soldcount);
    
    // Append multiple files with same key "images"
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });
    
    // Submit
    if (editingId) {
      updateProductMutation.mutate({ id: editingId, formData });
    } else {
      createProductMutation.mutate(formData);
    }
  }
});
```

**Critical Points:**
- Use `selectedFiles` state, NOT `values.images` for FormData
- Append each file with same key: `formData.append("images", file)`
- Backend expects field name "images" (matches route: `upload.array("images", 5)`)

---

### Step 4: Handle File Selection

```javascript
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  
  // Validate file count
  if (files.length > 5) {
    alert("Maximum 5 images allowed");
    return;
  }
  
  // Update Formik for validation
  formik.setFieldValue("images", files);
  
  // Store files for upload
  setSelectedFiles(files);
  
  // Create preview URLs
  const urls = files.map(file => URL.createObjectURL(file));
  setPreviewUrls(urls);
};
```

**Why `Array.from()`?**
- `e.target.files` is a FileList (not a real array)
- Convert to array for `.map()`, `.forEach()`, etc.

**Why `setFieldValue()`?**
- Updates Formik's internal state
- Triggers validation
- Updates `touched` state

---

### Step 5: Setup TanStack Query Mutations

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const queryClient = useQueryClient();

// Create Product
const createProductMutation = useMutation({
  mutationFn: async (formData) => {
    return axios.post(
      "http://localhost:5000/api/v1/product/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["products"]);
    formik.resetForm();
    resetFileInputs();
    alert("Product created successfully!");
  },
  onError: (error) => {
    alert(error.response?.data?.message || "Failed to create product");
  }
});

// Update Product
const updateProductMutation = useMutation({
  mutationFn: async ({ id, formData }) => {
    return axios.put(
      `http://localhost:5000/api/v1/product/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["products"]);
    formik.resetForm();
    resetFileInputs();
    setEditingId(null);
    alert("Product updated successfully!");
  }
});
```

**Important Headers:**
- `Content-Type: multipart/form-data` - Required for file uploads
- `Authorization: Bearer ${token}` - For protected routes

**Why `invalidateQueries`?**
- Refetches product list after mutation
- Keeps UI in sync with backend

---

### Step 6: HTML Input Element

```jsx
<input
  type="file"
  multiple  // Enable multiple file selection
  accept="image/jpeg,image/jpg,image/png,image/webp"
  onChange={handleFileChange}
  className="w-full p-3 border rounded-lg"
/>
```

**Attributes:**
- `multiple` - Allows selecting multiple files
- `accept` - Filters file picker to images only
- `onChange` - Triggers when files selected

---

### Step 7: Display Previews with Remove Option

```jsx
{previewUrls.length > 0 && (
  <div className="grid grid-cols-5 gap-4">
    {previewUrls.map((url, index) => (
      <div key={index} className="relative group">
        <img
          src={url}
          alt={`Preview ${index + 1}`}
          className="w-full h-32 object-cover rounded-lg"
        />
        
        {/* Remove button */}
        <button
          type="button"
          onClick={() => removePreviewImage(index)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6"
        >
          ×
        </button>
        
        <p className="text-xs text-center mt-1">
          {index === 0 ? "Primary" : `Image ${index + 1}`}
        </p>
      </div>
    ))}
  </div>
)}
```

---

### Step 8: Remove Preview Image

```javascript
const removePreviewImage = (index) => {
  const newFiles = selectedFiles.filter((_, i) => i !== index);
  const newUrls = previewUrls.filter((_, i) => i !== index);
  
  setSelectedFiles(newFiles);
  setPreviewUrls(newUrls);
  formik.setFieldValue("images", newFiles);
};
```

**Why filter by index?**
- Removes specific file from array
- Keeps other files intact
- Updates both files and previews

---

### Step 9: Display Validation Errors

```jsx
{formik.touched.images && formik.errors.images && (
  <p className="text-red-500 text-xs mt-1">
    {formik.errors.images}
  </p>
)}
```

**When errors show:**
- Field has been touched (`formik.touched.images`)
- Validation failed (`formik.errors.images`)

---

### Step 10: Reset Form After Submit

```javascript
const resetFileInputs = () => {
  setSelectedFiles([]);
  setPreviewUrls([]);
  formik.setFieldValue("images", []);
  
  // Optional: Reset file input element
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = '';
};
```

**Called after:**
- Successful create
- Successful update
- Cancel edit

---

## Common Pitfalls & Solutions

### ❌ Problem 1: Files not uploading
```javascript
// WRONG - Using formik values
formData.append("images", formik.values.images);
```

```javascript
// CORRECT - Using selectedFiles state
selectedFiles.forEach(file => {
  formData.append("images", file);
});
```

---

### ❌ Problem 2: Backend receives empty files
```javascript
// WRONG - Missing Content-Type header
axios.post(url, formData);
```

```javascript
// CORRECT - Include proper headers
axios.post(url, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

---

### ❌ Problem 3: Validation not working
```javascript
// WRONG - Not updating Formik
const handleFileChange = (e) => {
  setSelectedFiles(Array.from(e.target.files));
};
```

```javascript
// CORRECT - Update Formik for validation
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  formik.setFieldValue("images", files);  // Triggers validation
  setSelectedFiles(files);
};
```

---

### ❌ Problem 4: Memory leaks from preview URLs
```javascript
// Add cleanup in useEffect
useEffect(() => {
  return () => {
    // Revoke object URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  };
}, [previewUrls]);
```

---

## Complete Flow Diagram

```
User selects files
    ↓
handleFileChange()
    ↓
Convert FileList to Array
    ↓
Validate file count (max 5)
    ↓
Update Formik: formik.setFieldValue("images", files)
    ↓
Store files: setSelectedFiles(files)
    ↓
Create previews: URL.createObjectURL()
    ↓
Store preview URLs: setPreviewUrls(urls)
    ↓
User clicks Submit
    ↓
formik.handleSubmit()
    ↓
Yup validation runs
    ↓
If valid → onSubmit()
    ↓
Create FormData
    ↓
Append text fields
    ↓
Append files: formData.append("images", file) for each
    ↓
Call mutation: createProductMutation.mutate(formData)
    ↓
Axios sends multipart/form-data request
    ↓
Backend receives req.files array
    ↓
Upload to Cloudinary
    ↓
Save to database
    ↓
Response sent
    ↓
onSuccess callback
    ↓
Invalidate queries → Refetch products
    ↓
Reset form and file inputs
    ↓
Show success message
```

---

## Testing Checklist

- [ ] Select 1 image - should work
- [ ] Select 5 images - should work
- [ ] Select 6 images - should show error
- [ ] Select file > 5MB - should show error
- [ ] Select non-image file - should show error
- [ ] Remove preview image - should update count
- [ ] Submit form - should upload all files
- [ ] Check network tab - FormData should contain files
- [ ] Verify backend receives files in `req.files`
- [ ] Check Cloudinary - images should be uploaded
- [ ] Check database - URLs should be saved

---

## Summary

✅ **Key Takeaways:**
1. Use `formik.setFieldValue()` to update file field
2. Store files in separate state (`selectedFiles`)
3. Use `Array.from()` to convert FileList
4. Append files with `forEach` and same key
5. Include `Content-Type: multipart/form-data` header
6. Validate with Yup `.test()` for custom rules
7. Use `useMutation` for API calls
8. Invalidate queries after success
9. Clean up preview URLs to prevent memory leaks
10. Reset form and file inputs after submit

This implementation provides a complete, production-ready solution for multiple image uploads! 🎉
