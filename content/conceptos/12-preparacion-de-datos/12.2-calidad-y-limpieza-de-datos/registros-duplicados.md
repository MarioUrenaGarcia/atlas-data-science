---
id: registros-duplicados
titulo: Registros duplicados
titulo_en: Duplicate records
alias:
  - deduplicación
  - resolución de entidades
  - registros repetidos
  - record linkage
modulo: 12
submodulo: '12.2'
orden: 2
nivel: basico
prerrequisitos:
  - dimensiones-de-la-calidad-de-datos
etiquetas:
  - calidad de datos
  - unicidad
  - distancia de edición
  - limpieza
resumen: >
  Un registro duplicado representa a una entidad que ya está en la tabla. Los exactos se detectan comparando
  claves; los aproximados, con una medida de similitud y un umbral que equilibra uniones correctas y erróneas.
formula: '\operatorname{sim}(a, b) = 1 - \frac{d(a, b)}{\max(|a|, |b|)}'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: duplicados
    caso: clientes
    umbral: 0.85
referencias:
  - clave: lohr
publicado: true
---

## Intuición

Una cadena de tiendas une los clientes capturados en tres sucursales. La misma persona aparece como "María González López" en una y como "Maria Gonzalez Lopez" en otra, porque un teclado no tenía acentos. Si nadie lo nota, la cadena cree tener más clientes de los que tiene, le envía dos veces la misma promoción y cuenta dos veces sus compras al calcular el gasto promedio.

Los duplicados exactos son fáciles: dos filas idénticas. Los difíciles son los que difieren en detalles de escritura. Para encontrarlos se compara cada par de registros con una medida de **similitud** y se declara duplicado a todo par que supere un umbral. El umbral es una decisión con dos riesgos opuestos: si es bajo, se unen personas distintas que se escriben parecido (Juan y Juana); si es alto, se dejan separados registros de la misma persona con un error de dedo.

## Definición

:::definicion[Registro duplicado]
Dos registros $r_i$ y $r_j$ son **duplicados** si representan a la misma entidad del mundo real. La **deduplicación** estima esa relación a partir de una clave $k(r)$ (por ejemplo, nombre y teléfono) y una medida de similitud:

$$
\operatorname{sim}(a, b) = 1 - \frac{d(a, b)}{\max(|a|, |b|)},
$$

declarando duplicado el par si $\operatorname{sim}(k(r_i), k(r_j)) \ge \tau$. Los pares unidos se agrupan de forma transitiva: si $r_1$ se une con $r_2$ y $r_2$ con $r_3$, los tres forman un grupo.
:::

:::nota[Qué significa cada símbolo]
- $r_i$, $r_j$: registros de la tabla.
- $k(r)$: clave de comparación construida con los campos elegidos.
- $a$, $b$: dos claves en forma de texto.
- $d(a, b)$: distancia de edición de Levenshtein, el mínimo número de inserciones, eliminaciones o sustituciones de un carácter para convertir $a$ en $b$.
- $|a|$: longitud de la cadena $a$.
- $\operatorname{sim}(a, b)$: similitud entre $0$ y $1$; vale $1$ si las claves son idénticas.
- $\tau$: umbral de similitud a partir del cual se unen dos registros.
:::

## Cómo usar la visualización

La tabla muestra los registros y la clave que se compara. Al reproducir, cada par de registros se compara una vez; los dos registros del par actual se resaltan y el encabezado muestra su similitud contra el umbral. Los registros unidos reciben la misma etiqueta de grupo. Las lecturas cuentan los pares unidos correctamente (que sí son la misma entidad) y los unidos por error.

Experimentos sugeridos: activar "Normalizar texto antes de comparar" y ver cómo sube la similitud de los pares que solo difieren en acentos y mayúsculas; subir el umbral a 0.97 y observar cuáles duplicados verdaderos se pierden.

## Ejemplo

Se comparan claves de nombre y teléfono, sin normalizar, con $\tau = 0.85$.

1. "José Hernández 3311223344" contra "Jose Hernandes 3311223344": se sustituyen é, á y z, así que $d = 3$. Ambas tienen 25 caracteres: $\operatorname{sim} = 1 - 3/25 = 0.88 \ge 0.85$. Se unen.
2. "María González López 5512345678" contra "Maria Gonzalez Lopez 5512345678": $d = 3$ en 31 caracteres, $\operatorname{sim} = 0.903$. Se unen.
3. "Juan Pérez Ramos 2229876543" contra "Juana Pérez Ramos 2229876543": basta insertar una "a", $d = 1$ en 28 caracteres, $\operatorname{sim} = 0.964$. Se unen, pero son padre e hija que comparten teléfono: es una unión equivocada.

De 10 registros quedan 6 grupos; 3 de las 4 uniones son correctas.

:::figura[El ejemplo completo: con umbral 0.85 sin normalizar, los tres duplicados verdaderos se unen y también Juan con Juana.]{componente="DataQualityTable"}
```yaml
modo: duplicados
caso: clientes
umbral: 0.85
```
:::

## Propiedades

- **Normalizar antes de comparar aumenta la similitud de los duplicados** sin aumentar mucho la de registros distintos: con minúsculas y sin acentos, María y Maria quedan idénticas.

:::figura[Con el texto normalizado, la similitud de los dos registros de María sube a 1 y la de José a 0.96.]{componente="DataQualityTable"}
```yaml
modo: duplicados
caso: clientes
umbral: 0.85
normalizar: true
```
:::

- **El umbral regula dos errores.** Subirlo reduce las uniones equivocadas y aumenta los duplicados omitidos; bajarlo hace lo contrario.
- **Comparar todos los pares cuesta $\binom{n}{2}$ comparaciones.** Con 10 registros son 45; con un millón, casi $5 \times 10^{11}$. En la práctica se compara solo dentro de bloques que comparten, por ejemplo, el código postal.

:::figura[Catálogo de productos: tras normalizar, las variantes de escritura del mismo producto se unen y los productos distintos con el mismo inicio, como arroz blanco e integral, quedan separados.]{componente="DataQualityTable"}
```yaml
modo: duplicados
caso: productos
umbral: 0.9
normalizar: true
```
:::

## Errores comunes

- **Buscar solo duplicados exactos.** Las diferencias de acentos, mayúsculas o espacios son la causa más frecuente de duplicados y no las detecta una comparación exacta.
- **Elegir una clave que no distingue entidades.** Nombre y teléfono no separan a familiares que comparten teléfono; agregar la fecha de nacimiento a la clave evita esa unión.
- **Borrar duplicados sin consolidar su información.** Cada copia puede tener datos que la otra no tiene; antes de eliminar se combinan los campos.

:::figura[Error de subir el umbral para evitar uniones falsas: con 0.97, Juan y Juana se separan, pero también se pierde el duplicado de José, que difiere en una letra.]{componente="DataQualityTable"}
```yaml
modo: duplicados
caso: clientes
umbral: 0.97
normalizar: true
```
:::

## Conexiones

Los duplicados afectan la dimensión de unicidad descrita en [[dimensiones-de-la-calidad-de-datos]]. Normalizar las claves es el mismo procedimiento de [[inconsistencias-y-estandarizacion-de-valores]]. La distancia de edición es una de las [[distancias]] posibles entre objetos, y el número de pares comparados es un [[coeficiente-binomial]]. Agrupar de forma transitiva los pares unidos construye una [[relaciones-y-relaciones-de-equivalencia|relación de equivalencia]] cuyas clases son las entidades.

## Formulario

:::formula[Similitud normalizada por la distancia de edición]
$$
\operatorname{sim}(a, b) = 1 - \frac{d(a, b)}{\max(|a|, |b|)}
$$

- $a$, $b$: claves comparadas.
- $d(a, b)$: distancia de Levenshtein entre las claves.
- $|a|$, $|b|$: longitudes de las claves.
:::

:::formula[Regla de unión]
$$
\operatorname{sim}\big(k(r_i), k(r_j)\big) \ge \tau
$$

- $k(r_i)$: clave del registro $r_i$.
- $\tau$: umbral de similitud.
:::

:::formula[Número de pares por comparar]
$$
\binom{n}{2} = \frac{n(n-1)}{2}
$$

- $n$: número de registros.
:::
