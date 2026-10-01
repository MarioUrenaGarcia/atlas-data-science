---
id: determinante-como-factor-de-volumen
titulo: Determinante como factor de volumen
titulo_en: Determinant as a volume factor
alias:
  - determinante
  - área con signo
  - jacobiano lineal
modulo: 0
submodulo: '0.3'
orden: 18
nivel: basico
prerrequisitos:
  - multiplicacion-de-matrices-como-transformacion-lineal
  - independencia-lineal
etiquetas:
  - determinante
  - área
  - volumen
  - orientación
resumen: >
  El determinante de una matriz cuadrada es el factor por el que su transformación multiplica áreas o
  volúmenes, con signo negativo si invierte la orientación; vale cero cuando la matriz aplasta el espacio.
formula: '\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc, \qquad \operatorname{vol}(\mathbf{A}(R)) = |\det \mathbf{A}|\,\operatorname{vol}(R)'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: transformacion
    matrices:
      - nombre: A
        matriz: [[2, 1], [0.5, 1.5]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Una transformación lineal convierte el cuadrado unitario en un paralelogramo, y cualquier otra figura en una figura deformada. Como la rejilla entera se deforma de la misma manera, todas las áreas se multiplican por el mismo número: si el cuadrado unitario pasa a tener área 3, un círculo de área 2 pasa a tener área 6. Ese factor común es el valor absoluto del determinante.

El signo del determinante dice si la transformación conserva la orientación. Si lo que estaba en sentido contrario a las manecillas del reloj sigue así, el determinante es positivo; si la figura queda reflejada, como en un espejo, es negativo. Y si el determinante es cero, el paralelogramo se aplastó en un segmento o en un punto: la transformación comprime el plano a una recta, pierde información y no se puede deshacer. En tres dimensiones la historia es igual con volúmenes de cubos y paralelepípedos.

## Definición

:::definicion[Determinante de 2 por 2 y de 3 por 3]
$$
\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc,
$$
$$
\det\begin{pmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{pmatrix} = a_{11}(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(a_{21}a_{33} - a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31}).
$$
:::

:::teorema[Factor de volumen]
Para $\mathbf{A} \in \mathbb{R}^{n \times n}$ y cualquier región $R \subseteq \mathbb{R}^n$ con volumen,
$$
\operatorname{vol}(\mathbf{A}(R)) = |\det \mathbf{A}| \cdot \operatorname{vol}(R).
$$
En particular, $|\det \mathbf{A}|$ es el área (o volumen) del paralelogramo (o paralelepípedo) generado por las columnas de $\mathbf{A}$, y $\det \mathbf{A} < 0$ indica que $\mathbf{A}$ invierte la orientación.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz cuadrada de $n \times n$.
- $\det \mathbf{A}$: determinante de $\mathbf{A}$, un número real.
- $a, b, c, d$ y $a_{ij}$: entradas de la matriz.
- $R$: región del espacio, como el cuadrado unitario.
- $\mathbf{A}(R)$: imagen de la región bajo la transformación.
- $\operatorname{vol}$: área en el plano, volumen en el espacio.
- $|\cdot|$: valor absoluto.
:::

## Cómo usar la visualización

Las cuatro entradas de $\mathbf{A}$ se ajustan con los controles. La reproducción deforma la rejilla desde la identidad; el cuadrado unitario se convierte en el paralelogramo sombreado, amarillo si $\det \mathbf{A} > 0$ y naranja si $\det \mathbf{A} < 0$. El panel muestra el determinante como área con signo, junto con la traza y los valores propios.

Al llevar $d$ hasta que $ad - bc = 0$, el paralelogramo se aplasta en un segmento. Al intercambiar las columnas el paralelogramo es el mismo pero cambia de color: el determinante cambia de signo. Duplicar una columna duplica el área.

## Ejemplo

Un terreno en un plano se describe con coordenadas que luego se transforman a coordenadas de campo mediante $\mathbf{A} = \begin{pmatrix} 3 & 1 \\ 1 & 2 \end{pmatrix}$ (en metros por unidad del plano).

1. $\det \mathbf{A} = 3 \cdot 2 - 1 \cdot 1 = 5$.
2. El cuadrado unitario del plano se vuelve el paralelogramo con lados $(3, 1)$ y $(1, 2)$, de área 5 m².
3. Un lote que en el plano mide 12 unidades cuadradas mide en campo $5 \cdot 12 = 60$ m², sin importar su forma.
4. El signo positivo indica que la transformación no refleja el plano: una etiqueta que se lee en el plano se sigue leyendo igual en campo.
5. Como $\det \mathbf{A} \neq 0$, se puede regresar al plano con $\mathbf{A}^{-1}$, cuyo determinante es $1/5$.

:::figura[La transformación del ejemplo con sus entradas editables. El cuadrado unitario pasa a ser un paralelogramo de área 5 y el círculo unitario una elipse de área 5π.]{componente="MatrixTransform"}
```yaml
modo: transformacion
circulo: true
matrices:
  - nombre: Terreno
    matriz: [[3, 1], [1, 2]]
```
:::

## Propiedades

- **Multiplicativo:** $\det(\mathbf{A}\mathbf{B}) = \det \mathbf{A} \cdot \det \mathbf{B}$; aplicar dos transformaciones multiplica sus factores de área.
- **Inversa:** $\mathbf{A}$ es invertible si y solo si $\det \mathbf{A} \neq 0$, y entonces $\det \mathbf{A}^{-1} = 1/\det \mathbf{A}$.
- **Transpuesta:** $\det \mathbf{A}^\top = \det \mathbf{A}$.
- **Operaciones de fila:** intercambiar dos filas cambia el signo; multiplicar una fila por $c$ multiplica el determinante por $c$; sumar a una fila un múltiplo de otra no lo cambia.
- **Triangulares:** el determinante es el producto de la diagonal.
- **Escala:** $\det(cA) = c^n\det \mathbf{A}$ para $\mathbf{A}$ de $n \times n$.
- **Valores propios:** $\det \mathbf{A}$ es el producto de los valores propios, contados con multiplicidad.

:::figura[Casos según el signo del determinante: positivo conserva la orientación, negativo la invierte como un espejo y cero aplasta el plano sobre una recta.]{componente="MatrixTransform"}
```yaml
modo: transformacion
circulo: false
matrices:
  - nombre: Determinante positivo
    matriz: [[2, 0.5], [0.5, 1.5]]
  - nombre: Determinante negativo
    matriz: [[0.5, 1.5], [2, 0.5]]
  - nombre: Determinante cero
    matriz: [[2, 1], [1, 0.5]]
```
:::

:::demostracion
Área del paralelogramo con lados $(a, c)$ y $(b, d)$ en el primer cuadrante: el rectángulo de lados $a + b$ y $c + d$ mide $(a + b)(c + d)$. Quitando los dos triángulos de área $ac/2$, los dos de área $bd/2$ y los dos rectángulos de área $bc$ que lo rodean, queda $(a + b)(c + d) - ac - bd - 2bc = ad - bc$.
:::

## Errores comunes

- **Pensar que el determinante mide el tamaño de las entradas.** Una matriz con entradas grandes puede tener determinante cero, y una con entradas pequeñas uno grande.
- **Escribir $\det(\mathbf{A} + \mathbf{B}) = \det \mathbf{A} + \det \mathbf{B}$.** El determinante no es lineal en la matriz entera.
- **Usar un determinante pequeño como prueba de casi singularidad.** $\det(0.1\,\mathbf{I}_{10}) = 10^{-10}$ y la matriz está perfectamente condicionada; para eso se usa el número de condición.
- **Hablar del determinante de una matriz no cuadrada.** Solo existe para matrices cuadradas.

## Conexiones

El determinante mide cuánto estira áreas una [[multiplicacion-de-matrices-como-transformacion-lineal|transformación lineal]] y es cero exactamente cuando las columnas pierden la [[independencia-lineal]]. Decide si existe la [[matriz-identidad-y-matriz-inversa|inversa]] y define el [[polinomio-caracteristico]]. En probabilidad, el valor absoluto del determinante del jacobiano ajusta las densidades cuando se cambian variables; en la distribución normal multivariada, $\det\boldsymbol{\\Sigma}$ mide el volumen de la nube de datos.

## Formulario

:::formula[Determinante de 2 por 2]
$$
\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc
$$

- $a, b, c, d$: entradas de la matriz.
:::

:::formula[Factor de volumen]
$$
\operatorname{vol}(\mathbf{A}(R)) = |\det \mathbf{A}| \cdot \operatorname{vol}(R)
$$

- $R$: región; $\mathbf{A}(R)$: su imagen.
- $|\det \mathbf{A}|$: factor de escala de áreas o volúmenes.
:::

:::formula[Propiedades]
$$
\det(\mathbf{A}\mathbf{B}) = \det \mathbf{A}\,\det \mathbf{B}, \qquad \det \mathbf{A}^{-1} = \frac{1}{\det \mathbf{A}}, \qquad \det(cA) = c^n\det \mathbf{A}
$$

- $n$: tamaño de la matriz.
- $c$: escalar.
:::

:::formula[Triangulares y valores propios]
$$
\det \mathbf{U} = \prod_i u_{ii}, \qquad \det \mathbf{A} = \prod_i \lambda_i
$$

- $u_{ii}$: diagonal de una matriz triangular.
- $\lambda_i$: valores propios de $\mathbf{A}$.
:::
